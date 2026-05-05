export default function handler(req: any, res: any) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'kudiflow.vercel.app';
  const baseUrl = `${protocol}://${host}`;

  const robots = `User-agent: *
Allow: /

# Protect internal dashboard and api routes
Disallow: /dashboard/
Disallow: /api/

# Point bots to the dynamic sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  // Cache for 24 hours
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  res.status(200).send(robots);
}
