import type { MetadataRoute } from "next";
import { getPackages, packageSlug } from "@/lib/data/packages";

const SITE_URL = "https://xhabesafarilodge.com";

const routes = [
  "",
  "/about",
  "/accommodation",
  "/activities",
  "/packages",
  "/gallery",
  "/reviews",
  "/book",
  "/contact",
  "/privacy",
  "/booking-terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority:
      route === "" ? 1 : route === "/book" || route === "/contact" || route === "/packages" ? 0.9 : 0.7,
  }));

  // Each package's detail page is a real landing page, so list them too.
  const { packages } = await getPackages();
  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${SITE_URL}/packages/${packageSlug(pkg)}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...packageEntries];
}
