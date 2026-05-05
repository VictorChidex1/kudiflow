import admin from "firebase-admin";

let adminInitialized = false;

async function getAdmin() {
  if (!admin.apps.length && !adminInitialized) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      adminInitialized = true;
    }
  }
  return admin;
}

export default async function handler(req: any, res: any) {
  try {
    // 1. Get the path correctly from the Vercel rewrite
    const pathQuery = Array.isArray(req.query.path)
      ? req.query.path[0]
      : req.query.path;
    let urlPath = "/" + (pathQuery || "").split("?")[0];

    // Clean up double slashes if any
    urlPath = urlPath.replace(/\/\//g, "/");

    // 2. Fetch the raw index.html using a secure loopback to avoid Vercel filesystem limits
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers.host || "kudiflow.vercel.app";
    const fullUrl = `${protocol}://${host}${urlPath}`;

    let html = "";
    try {
      const response = await fetch(`${protocol}://${host}/index.html`);
      if (!response.ok)
        throw new Error(`Fetch failed with status ${response.status}`);
      html = await response.text();
    } catch (e) {
      console.error("Could not fetch index.html loopback", e);
      // Fallback minimal HTML structure for bots if fetch fails
      html = `<!DOCTYPE html><html lang="en"><head></head><body></body></html>`;
    }

    // Default Meta Tags
    let title = "KudiFlow | The Offline-First App for Smart Vendors";
    let description =
      "Ditch messy ledgers. Track daily sales, manage inventory, and seamlessly collect debts—all without data.";
    let image = "https://kudiflow.vercel.app/assets/main-hero-image.webp";

    if (urlPath === "/about") {
      title = "About Us | KudiFlow";
      description =
        "Learn more about our mission to empower MSMEs in emerging markets.";
    } else if (urlPath === "/contact") {
      title = "Contact Us | KudiFlow";
      description = "Get in touch with the KudiFlow support team.";
    } else if (urlPath === "/docs" || urlPath.startsWith("/docs")) {
      title = "Documentation & Guides | KudiFlow";
      description =
        "Learn how to master KudiFlow. Comprehensive guides on inventory, sales, debtors, and more.";
    } else if (urlPath === "/login" || urlPath === "/signup") {
      title = "Join KudiFlow | Sign In & Sign Up";
      description =
        "Access your KudiFlow dashboard to manage sales and inventory securely.";
    } else if (urlPath === "/forgot-password" || urlPath === "/reset-password") {
      title = "Account Recovery | KudiFlow";
      description = "Recover or reset your KudiFlow account password securely.";
    } else if (urlPath === "/verify-email") {
      title = "Verify Email | KudiFlow";
      description = "Verify your email address to unlock full KudiFlow features.";
    } else if (urlPath === "/privacy-policy") {
      title = "Privacy Policy | KudiFlow";
      description = "Learn how KudiFlow protects your data and respects your privacy.";
    } else if (urlPath === "/terms-of-service") {
      title = "Terms of Service | KudiFlow";
      description = "Read the terms and conditions for using the KudiFlow platform.";
    } else if (urlPath === "/coming-soon") {
      title = "Coming Soon | KudiFlow";
      description = "We are working on exciting new features. Stay tuned!";
    } else if (urlPath === "/blog") {
      title = "KudiFlow Blog | Tips for Market Vendors";
      description =
        "Read the latest tips, tricks, and updates for small businesses from KudiFlow.";
    } else if (urlPath.startsWith("/blog/") && urlPath.length > 6) {
      // Dynamic blog post fetching
      const slug = urlPath.split("/blog/")[1].replace(/\/$/, ""); // clean trailing slash
      const adminInstance = await getAdmin();

      if (adminInstance.apps.length > 0) {
        const db = adminInstance.firestore();
        const snapshot = await db
          .collection("blogs")
          .where("slug", "==", slug)
          .where("status", "==", "published")
          .limit(1)
          .get();
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

    // 4. Clean existing meta tags so we don't have duplicates
    html = html.replace(/<title>.*?<\/title>/gi, "");
    html = html.replace(
      /<meta[^>]*(name|property)="(description|og:|twitter:)[^>]*>/gi,
      ""
    );

    // 5. Inject the flawless new Meta Tags
    let robotsTag = '';
    if (urlPath.startsWith('/dashboard')) {
      robotsTag = `<meta name="robots" content="noindex, nofollow" />`;
    }

    const ogTags = `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${fullUrl}" />
    ${robotsTag}
    
    <!-- Open Graph (Facebook/LinkedIn/WhatsApp) -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${fullUrl}" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:url" content="${fullUrl}" />
    `;

    html = html.replace("</head>", `${ogTags}\n  </head>`);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=86400"); // Cache for 1 min on edge, serve stale while updating
    res.status(200).send(html);
  } catch (err: any) {
    console.error("SEO Interceptor Error:", err);
    res
      .status(500)
      .json({ error: "Failed to process SEO request.", details: err.message });
  }
}
