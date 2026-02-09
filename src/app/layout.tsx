import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free IP Geolocation API | Get Location by IP Address | Kamero",
  description:
    "Free IP geolocation API that returns city, country, continent, timezone, coordinates, and postal code. No API key required. Open source, fast, and reliable. Powered by Vercel Edge Network.",
  keywords: [
    "free ip geolocation api",
    "ip to location api",
    "get location by ip",
    "ip address lookup api",
    "free geo ip api",
    "ip geolocation service",
    "ip to city api",
    "ip to country api",
    "ip timezone api",
    "ip location lookup",
    "geolocation api free",
    "ip address geolocation",
    "rest api geolocation",
    "json ip location",
    "open source geolocation api",
    "vercel geolocation",
    "no api key geolocation",
  ],
  authors: [{ name: "Kamero AI", url: "https://kamero.ai" }],
  creator: "Kamero AI",
  publisher: "Kamero AI",
  metadataBase: new URL("https://geo.kamero.ai"),
  alternates: {
    canonical: "https://geo.kamero.ai",
  },
  openGraph: {
    title: "Free IP Geolocation API | No API Key Required | Kamero",
    description:
      "Get user location by IP address instantly. Returns IP, city, country, continent, timezone, coordinates, and postal code. 100% free and open source.",
    url: "https://geo.kamero.ai",
    siteName: "Kamero Geo IP API",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IP Geolocation API | No API Key Required",
    description:
      "Get user location by IP address instantly. Returns IP, city, country, continent, timezone, and more. 100% free.",
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

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Kamero Geo IP API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kamero Geo IP API is a free, open-source REST API that returns geolocation data based on the visitor's IP address. It provides information including IP address, city, country, region, continent, coordinates (latitude/longitude), timezone, and postal code.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an API key to use this service?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, you don't need an API key. The API is completely free to use and requires no registration or authentication. Simply make a GET request to the endpoint and receive your geolocation data.",
      },
    },
    {
      "@type": "Question",
      name: "What data does the API return?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The API returns: IP address, city name, country code (ISO 3166-1), region/state code (ISO 3166-2), continent code, latitude, longitude, timezone (IANA format), postal/ZIP code, and the Vercel edge region that served your request.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the geolocation data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The geolocation data is provided by Vercel's Edge Network, which uses industry-standard IP geolocation databases. Accuracy varies by region but is generally accurate to the city level for most locations.",
      },
    },
    {
      "@type": "Question",
      name: "What is the response time of the API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The API is powered by Vercel's global Edge Network, delivering sub-50ms response times for most locations worldwide.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this API in production?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The API is designed for production use. It's open-source under the MIT license, has CORS enabled for all origins, and you can also self-host your own instance by deploying to Vercel.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a rate limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The hosted API at geo.kamero.ai has no enforced rate limits. For high-volume applications, we recommend deploying your own instance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I self-host this API?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The entire project is open-source on GitHub. You can deploy your own instance to Vercel with one click. Note that geolocation headers only work when deployed to Vercel.",
      },
    },
  ],
};

const webAppStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Kamero Geo IP API",
  description:
    "Free, open-source IP geolocation API. Get user location by IP address including city, country, continent, timezone, coordinates, and postal code.",
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
  featureList: [
    "IP address lookup",
    "City detection",
    "Country detection",
    "Continent detection",
    "Timezone detection",
    "Postal code lookup",
    "Latitude and longitude coordinates",
    "No API key required",
    "CORS enabled",
    "Open source",
  ],
};

const apiStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebAPI",
  name: "Kamero Geo IP Location API",
  description:
    "REST API for IP geolocation. Returns JSON with IP, city, country, continent, timezone, coordinates, and postal code.",
  url: "https://geo.kamero.ai/api/geo",
  documentation: "https://geo.kamero.ai/docs",
  provider: {
    "@type": "Organization",
    name: "Kamero AI",
    url: "https://kamero.ai",
  },
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kamero AI",
  url: "https://kamero.ai",
  logo: "https://geo.kamero.ai/kamero_logo.svg",
  sameAs: ["https://github.com/kamero-ai"],
};

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://geo.kamero.ai",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: "https://geo.kamero.ai/docs",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Blog",
      item: "https://geo.kamero.ai/blog",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/kamero_logo.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(apiStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
