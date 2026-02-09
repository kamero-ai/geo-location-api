import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geo.kamero.ai";

  const blogPosts = [
    { slug: "free-ip-geolocation-api-comparison-2026", date: "2026-02-09" },
    { slug: "how-to-get-user-location-by-ip-javascript", date: "2026-02-08" },
    { slug: "ip-geolocation-use-cases-for-developers", date: "2026-02-07" },
    { slug: "build-location-aware-app-nextjs", date: "2026-02-06" },
    { slug: "ip-geolocation-accuracy-explained", date: "2026-02-05" },
    { slug: "ip-geolocation-python-tutorial", date: "2026-02-04" },
    { slug: "geo-redirect-visitors-by-country", date: "2026-02-03" },
    { slug: "what-is-my-ip-address-explained", date: "2026-02-02" },
    { slug: "detect-user-timezone-javascript", date: "2026-02-01" },
    { slug: "ip-geolocation-gdpr-privacy-compliance", date: "2026-01-30" },
    { slug: "ip-geolocation-fraud-detection-guide", date: "2026-01-28" },
    { slug: "show-local-currency-pricing-by-ip", date: "2026-01-26" },
    { slug: "ip-geolocation-php-tutorial", date: "2026-01-24" },
    { slug: "self-host-ip-geolocation-api-vercel", date: "2026-01-22" },
    { slug: "ip-geolocation-go-golang-tutorial", date: "2026-01-20" },
    { slug: "ipv4-vs-ipv6-differences-explained", date: "2026-01-18" },
    { slug: "ip-geolocation-curl-api-testing", date: "2026-01-16" },
    { slug: "geo-blocking-restrict-access-by-country", date: "2026-01-15" },
    { slug: "ip-geolocation-react-native-mobile", date: "2026-01-14" },
    { slug: "ip-geolocation-csharp-dotnet-tutorial", date: "2026-01-14" },
    { slug: "vpn-proxy-detection-ip-geolocation", date: "2026-01-13" },
    { slug: "ip-geolocation-ruby-rails-tutorial", date: "2026-01-12" },
    { slug: "ip-geolocation-java-spring-boot", date: "2026-01-12" },
    { slug: "content-localization-i18n-geolocation", date: "2026-01-10" },
    { slug: "ip-geolocation-serverless-edge-functions", date: "2026-01-08" },
    { slug: "ip-geolocation-analytics-dashboards", date: "2026-01-06" },
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
