import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Kamero Geo IP Blog",
    default: "Blog | Free IP Geolocation API Guides & Tutorials | Kamero",
  },
  description:
    "Guides, tutorials, and insights on IP geolocation, location APIs, and building location-aware applications. Learn how to use free IP lookup APIs in your projects.",
  keywords: [
    "ip geolocation blog",
    "ip address lookup guide",
    "geolocation api tutorial",
    "free ip api guide",
    "ip to location tutorial",
    "geolocation for developers",
    "ip address tracking guide",
    "location api comparison",
  ],
  alternates: {
    canonical: "https://geo.kamero.ai/blog",
  },
  openGraph: {
    title: "Blog | Free IP Geolocation API Guides & Tutorials",
    description:
      "Guides, tutorials, and insights on IP geolocation and building location-aware applications.",
    url: "https://geo.kamero.ai/blog",
    siteName: "Kamero Geo IP API",
    locale: "en_US",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
