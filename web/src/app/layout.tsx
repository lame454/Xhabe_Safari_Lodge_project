import type { Metadata } from "next";
import { Gilda_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/config/site";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { lodgingBusinessSchema, webSiteSchema } from "@/lib/seo/structuredData";

const gildaDisplay = Gilda_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Builds the verification block, omitting any provider that has no value set. */
function verificationTags(): Metadata["verification"] {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  if (!google && !bing) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  };
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  /*
   * Both www.xhabesafari.com and the apex serve the site, which without this
   * looks to a search engine like two separate sites carrying identical
   * content. `"./"` resolves against metadataBase and the current path, so
   * every page declares the apex as its one true address.
   */
  alternates: { canonical: "./" },
  title: "Xhabe Safari Lodge | Chobe Riverfront, Botswana",
  /*
   * Fallback description, used only by pages that do not set their own.
   *
   * It previously said "8-room", which contradicted the 9 chalets stated by
   * lib/data/capacity.ts and every page that reads from it. A site that
   * disagrees with itself about a countable fact is exactly what stops an
   * assistant quoting either version, so the number here is the verified one.
   */
  description:
    "A nine-chalet tented luxury lodge and campsite on a plateau above the Chobe River floodplain in northern Botswana, 5 km from Chobe National Park.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_BW",
    siteName: "Xhabe Safari Lodge",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Xhabe Safari Lodge, Chobe, Botswana" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  /*
   * Search Console's HTML tag verification method. Set
   * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the content value Search Console
   * gives you (Settings → Ownership verification → HTML tag) and this
   * renders <meta name="google-site-verification" content="..." />
   * automatically. Left unset, Next omits the field entirely — no empty tag.
   */
  /*
   * Ownership verification for Google and Bing, both driven by env vars so
   * that verifying a site never requires a code change and a redeploy.
   *
   * Bing matters more than its market share suggests: it is the index behind
   * Copilot and it feeds part of ChatGPT's search, so a site missing from
   * Bing is missing from those answers regardless of how it ranks on Google.
   * Bing's tag is `msvalidate.01`, which Next has no named field for, hence
   * `other`.
   *
   * Unset, Next omits the field rather than rendering an empty tag.
   */
  verification: verificationTags(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gildaDisplay.variable} ${nunitoSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {/*
          * Describes the lodge as an entity to every crawler, on every page.
          *
          * In the layout rather than on the homepage alone because an
          * assistant may fetch any single page and should be able to identify
          * the business from it without following a link.
          */}
        <JsonLd schema={[lodgingBusinessSchema(), webSiteSchema()]} />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
