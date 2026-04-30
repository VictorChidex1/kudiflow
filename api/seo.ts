import fs from 'fs';
import path from 'path';

let adminInitialized = false;

async function getAdmin() {
  const admin = await import("firebase-admin");
  if (!admin.apps.length && !adminInitialized) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      adminInitialized = true;
    }
  }
  return admin;
}

export default async function handler(req: any, res: any) {
  try {
    const urlPath = req.url?.split('?')[0] || '/';
    
    // Read the built index.html from dist
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    let html = '';
    
    try {
      html = fs.readFileSync(indexPath, 'utf-8');
    } catch (e) {
      console.error("Could not read index.html from dist", e);
      return res.status(500).send("Internal Server Error: Missing index.html");
    }

    // Default Meta Tags
    let title = "KudiFlow | The Offline-First App for Smart Vendors";
    let description = "Ditch messy ledgers. Track daily sales, manage inventory, and seamlessly collect debts—all without data.";
    let image = "https://kudiflow.vercel.app/assets/main-hero-image.webp";

    // Route specific static meta
    if (urlPath === '/about') {
      title = "About Us | KudiFlow";
      description = "Learn more about our mission to empower MSMEs in emerging markets.";
    } else if (urlPath === '/contact') {
      title = "Contact Us | KudiFlow";
      description = "Get in touch with the KudiFlow support team.";
    } else if (urlPath === '/docs') {
      title = "Documentation | KudiFlow";
      description = "Guides and tutorials for using KudiFlow to the fullest.";
    } else if (urlPath === '/login' || urlPath === '/signup') {
      title = "Join KudiFlow | Sign In & Sign Up";
      description = "Access your KudiFlow dashboard to manage sales and inventory.";
    } else if (urlPath === '/blog') {
      title = "KudiFlow Blog";
      description = "Read the latest tips, tricks, and updates for small businesses from KudiFlow.";
    } else if (urlPath.startsWith('/blog/') && urlPath.length > 6) {
      // Dynamic blog post fetching
      const slug = urlPath.split('/blog/')[1];
      const admin = await getAdmin();
      
      if (admin.apps.length > 0) {
        const db = admin.firestore();
        const snapshot = await db.collection('blogs').where('slug', '==', slug).where('status', '==', 'published').limit(1).get();
        if (!snapshot.empty) {
          const post = snapshot.docs[0].data();
          title = `${post.title} | KudiFlow`;
          description = post.excerpt || description;
          image = post.coverImage || image;
        } else {
          title = "Post Not Found | KudiFlow";
        }
      }
    }

    // Inject Meta Tags right before </head>
    const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://kudiflow.vercel.app${urlPath}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    `;

    // Replace the generic <title>
    html = html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`);
    
    // Inject the OG Tags
    html = html.replace('</head>', `${ogTags}</head>`);

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);

  } catch (err: any) {
    console.error("SEO Interceptor Error:", err);
    res.status(500).json({ error: "Failed to process SEO request.", details: err.message });
  }
}
