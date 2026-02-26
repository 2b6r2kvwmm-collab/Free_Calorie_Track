import { Helmet } from 'react-helmet-async';

export default function SEO({
  title,
  description,
  keywords = [],
  image = 'https://freecalorietrack.com/og-image.png',
  url,
  type = 'article',
  author = 'Griffin'
}) {
  const fullTitle = title ? `${title} | Free Calorie Track` : 'Free Calorie Track - Free Calorie & Macro Tracker | No Paywalls, No Ads';
  const fullUrl = url ? `https://freecalorietrack.com${url}` : 'https://freecalorietrack.com/';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Free Calorie Track" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Article specific */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          <meta property="article:published_time" content={new Date().toISOString()} />
        </>
      )}
    </Helmet>
  );
}
