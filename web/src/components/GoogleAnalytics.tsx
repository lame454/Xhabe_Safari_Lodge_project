import Script from "next/script";

/**
 * GA4 tracking (gtag.js), gated on NEXT_PUBLIC_GA_MEASUREMENT_ID.
 *
 * The lodge's real GA4 measurement ID (format "G-XXXXXXXXXX", found under
 * Google Analytics → Admin → Data Streams → your web stream) needs to be set
 * as NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local for local development, and
 * in the Vercel project's environment variables for the deployed site.
 *
 * Until that env var is set, this renders nothing — no script tags, no
 * network requests — so the build and every page stay unaffected.
 */
export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
