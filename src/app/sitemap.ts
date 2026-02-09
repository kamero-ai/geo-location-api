import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geo.kamero.ai";

  const blogPosts = [
    {
      slug: "free-ip-geolocation-api-comparison-2026",
      date: "2026-02-09",
    },
    {
      slug: "how-to-get-user-location-by-ip-javascript",
      date: "2026-02-08",
    },
    {
      slug: "ip-geolocation-use-cases-for-developers",
      date: "2026-02-07",
    },
    {
      slug: "build-location-aware-app-nextjs",
      date: "2026-02-06",
    },
    {
      slug: "ip-geolocation-accuracy-explained",
      date: "2026-02-05",
    },
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${baseUrl}/api/geo`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
