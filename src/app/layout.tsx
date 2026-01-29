import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Geo IP Location API | Get User Location by IP | Kamero",
  description:
    "Free, open-source geolocation API to get user location by IP address. Returns city, country, coordinates, and region. No API key required. Powered by Vercel Edge Network.",
  keywords: [
    "free geo ip api",
    "free geolocation api",
    "ip location api",
    "get user location",
    "ip to location",
    "free ip geolocation",
    "geo ip lookup",
    "ip address location",
    "geolocation by ip",
    "free location api",
    "ip to city api",
    "ip to country api",
    "vercel geolocation",
    "open source geo api",
  ],
  authors: [{ name: "Kamero AI", url: "https://kamero.ai" }],
  creator: "Kamero AI",
  publisher: "Kamero AI",
  metadataBase: new URL("https://geo.kamero.ai"),
  alternates: {
    canonical: "https://geo.kamero.ai",
  },
  openGraph: {
    title: "Free Geo IP Location API | Kamero",
    description:
      "Free, open-source API to get user geolocation by IP. No API key required.",
    url: "https://geo.kamero.ai",
    siteName: "Kamero Geo Location API",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Geo IP Location API | Kamero",
    description:
      "Free, open-source API to get user geolocation by IP. No API key required.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kamero_logo.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Kamero Geo Location API",
              description:
                "Free, open-source geolocation API to get user location by IP address",
              url: "https://geo.kamero.ai",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              provider: {
                "@type": "Organization",
                name: "Kamero AI",
                url: "https://kamero.ai",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
