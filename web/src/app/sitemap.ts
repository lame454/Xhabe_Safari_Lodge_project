import type { MetadataRoute } from "next";

const routes = ["", "/about", "/accommodation", "/activities", "/gallery", "/reviews", "/book", "/contact", "/privacy", "/booking-terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `https://xhabesafarilodge.com${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/book" || route === "/contact" ? 0.9 : 0.7,
  }));
}
