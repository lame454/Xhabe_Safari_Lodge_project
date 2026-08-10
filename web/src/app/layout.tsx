import type { Metadata } from "next";
import { Gilda_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/config/site";

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
  description: "An intimate 8-room tented luxury lodge and camping experience overlooking the Chobe River floodplains and Namibian border in Botswana.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${gildaDisplay.variable} ${nunitoSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
