import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation | Free Geo IP Location API | Kamero",
  description:
    "Complete documentation for Kamero Geo Location API. Learn how to get user location by IP address with code examples in JavaScript, Python, PHP, Go, and cURL. Free, no API key required.",
  keywords: [
    "geo ip api documentation",
    "geolocation api tutorial",
    "how to get user location by ip",
    "ip to location api example",
    "free geolocation api docs",
    "javascript get user location",
    "python ip geolocation",
    "self host geo ip api",
  ],
  alternates: {
    canonical: "https://geo.kamero.ai/docs",
  },
  openGraph: {
    title: "API Documentation | Free Geo IP Location API",
    description:
      "Learn how to get user location by IP address. Code examples in JavaScript, Python, PHP, Go.",
    url: "https://geo.kamero.ai/docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
