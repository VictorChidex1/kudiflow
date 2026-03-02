import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
}

export default function SEO({
  title,
  description = "KudiFlow - The Offline-First Shop Manager. Stop using paper ledgers and start tracking your sales, inventory, and debtors faster than ever, even without an internet connection.",
  name = "KudiFlow",
  type = "website",
  image = "https://kudiflow.vercel.app/assets/hero.webp",
  url = "https://kudiflow.vercel.app/",
}: SEOProps) {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title} | KudiFlow</title>
      <meta name="description" content={description} />

      {/* Open Graph / LinkedIn / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={`${title} | KudiFlow`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | KudiFlow`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
