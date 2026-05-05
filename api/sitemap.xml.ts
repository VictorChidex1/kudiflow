import admin from "firebase-admin";

let adminInitialized = false;

async function getAdmin() {
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
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'kudiflow.vercel.app';
    const baseUrl = `${protocol}://${host}`;

    // Static pages mapped with standard priority and changefreq
    const staticPages = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.5 },
      { url: '/docs', changefreq: 'weekly', priority: 0.9 },
      { url: '/blog', changefreq: 'daily', priority: 0.9 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
      { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
      { url: '/login', changefreq: 'yearly', priority: 0.5 },
      { url: '/signup', changefreq: 'yearly', priority: 0.5 },
    ];

    let blogUrls = "";
    
    // Attempt to fetch dynamic blog posts from Firestore
    try {
      const adminInstance = await getAdmin();
      if (adminInstance.apps.length > 0) {
        const db = adminInstance.firestore();
        const snapshot = await db.collection('blogs').where('status', '==', 'published').get();
        
        snapshot.forEach(doc => {
          const post = doc.data();
          const lastMod = post.updatedAt ? new Date(post.updatedAt._seconds * 1000).toISOString() : new Date().toISOString();
          blogUrls += `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
      }
    } catch (dbErr) {
      console.error("Sitemap: Failed to fetch blogs from Firestore", dbErr);
      // We continue building the sitemap with just the static pages if the DB fails
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
  ${blogUrls}
</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400'); // Cache for 1 hr on edge
    res.status(200).send(sitemap);
  } catch (error: any) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Internal Server Error generating sitemap.");
  }
}
