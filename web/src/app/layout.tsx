import type { Metadata } from "next";
import { Gilda_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://xhabesafarilodge.com"),
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
