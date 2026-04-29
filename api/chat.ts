import { GoogleGenAI } from '@google/genai';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines from environment variable string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, idToken } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    let isAuthenticated = false;
    let uid = null;

    // Verify Firebase token if provided
    if (idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        isAuthenticated = true;
      } catch (authError) {
        console.error('Auth verification failed:', authError);
        // Continue as unauthenticated if token fails, or return 401
      }
    }

    // Prepare system instructions based on auth state
    const systemInstruction = isAuthenticated
      ? `You are KudiFlow's AI Assistant, currently speaking to an authenticated user (UID: ${uid}). Your role is to help them manage their MSME business. You are helpful, precise, and concise. You can assist them with understanding their ledger, inventory, and debtors.`
      : `You are KudiFlow's friendly AI Sales and Support Assistant. You are speaking to a visitor on our landing page. KudiFlow is a lightweight, offline-first MSME Business OS that helps businesses track sales, manage inventory with traffic-light alerts, and politely collect debts via WhatsApp. Convince them to sign up, answer questions about the product, and be incredibly helpful. Be concise.`;

    // Extract the latest user message and the history
    // GenAI requires contents array in specific format: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Call Gemini 1.5 Pro
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.status(200).json({
      role: 'assistant',
      content: response.text,
    });

  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ error: 'Failed to process AI request', details: error.message });
  }
}
