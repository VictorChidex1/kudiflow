import { GoogleGenAI } from "@google/genai";

// ─── Gemini Client ─────────────────────────────────────────────────────────────
// Firebase Admin is optional (for auth users).

// ─── Lazy Firebase Admin Initializer ──────────────────────────────────────────
// We only load firebase-admin when we actually have an idToken to verify.
// This prevents a crash when Firebase env vars are not set.
let adminInitialized = false;

async function verifyToken(idToken: string): Promise<string | null> {
  try {
    const admin = await import("firebase-admin");
    if (!admin.apps.length && !adminInitialized) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      );

      if (!projectId || !clientEmail || !privateKey) {
        console.warn(
          "Firebase Admin env vars not set. Skipping auth verification."
        );
        return null;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      adminInitialized = true;
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded.uid;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}

// ─── Request Handler ──────────────────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate API key is present
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Server configuration error: GEMINI_API_KEY is not set.",
    });
  }

  // Initialize Gemini Client inside handler to ensure env vars are fully loaded
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const { messages, idToken } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "A non-empty messages array is required." });
    }

    // Determine user context
    let uid: string | null = null;
    if (idToken && typeof idToken === "string") {
      uid = await verifyToken(idToken);
    }

    const isAuthenticated = !!uid;

    // ── System Prompt ────────────────────────────────────────────────────────
    const systemInstruction = isAuthenticated
      ? `You are KudiFlow's AI Assistant, helping an authenticated business owner manage their MSME. Be precise, friendly, and concise. You help with their sales ledger, inventory tracking, and debtor management.`
      : `You are KudiFlow's friendly AI Sales and Support Assistant on the public landing page. KudiFlow is a lightweight, offline-first Business OS for MSMEs in emerging markets. It provides a 3-second sales ledger, a polite debt collector via WhatsApp, and an inventory traffic-light system — all without needing reliable internet. Enthusiastically answer questions and guide visitors to sign up. Be concise and warm.`;

    // ── Format Message History ────────────────────────────────────────────────
    const formattedContents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content) }],
    }));

    // ── Call Gemini 2.5 Flash (fast, cost-effective, latest) ────────────────
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return res.status(200).json({
      role: "assistant",
      content: response.text,
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      error: "Failed to process AI request.",
      details: error.message,
    });
  }
}
