import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin area is password-gated, but keep it out of search results
      // too — an indexed login page is an invitation to guess at it.
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: "https://xhabesafarilodge.com/sitemap.xml",
  };
}
