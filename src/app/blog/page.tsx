import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeProvider";
import "./blog.css";

const posts = [
  {
    slug: "free-ip-geolocation-api-comparison-2026",
    title: "Free IP Geolocation APIs Compared: Which One Should You Use in 2026?",
    description:
      "A side-by-side comparison of the top free IP geolocation APIs including Kamero, ipgeolocation.io, IP-Sonar, ipapi, and more. Covers accuracy, speed, rate limits, and data fields.",
    tag: "Comparison",
    date: "Feb 9, 2026",
    readTime: "8 min read",
  },
  {
    slug: "how-to-get-user-location-by-ip-javascript",
    title: "How to Get User Location by IP Address in JavaScript (2026 Guide)",
    description:
      "Step-by-step tutorial on detecting visitor location using IP geolocation APIs in JavaScript. Covers fetch, error handling, React hooks, and Next.js server-side usage.",
    tag: "Tutorial",
    date: "Feb 8, 2026",
    readTime: "10 min read",
  },
  {
    slug: "ip-geolocation-use-cases-for-developers",
    title: "7 Practical IP Geolocation Use Cases Every Developer Should Know",
    description:
      "From content personalization and timezone detection to fraud prevention and geo-blocking — real-world examples of how developers use IP location data in production apps.",
    tag: "Guide",
    date: "Feb 7, 2026",
    readTime: "7 min read",
  },
  {
    slug: "build-location-aware-app-nextjs",
    title: "Build a Location-Aware App with Next.js and a Free Geolocation API",
    description:
      "Learn how to build a full-stack location-aware application using Next.js App Router and a free IP geolocation API. Includes map integration, server components, and deployment.",
    tag: "Tutorial",
    date: "Feb 6, 2026",
    readTime: "12 min read",
  },
  {
    slug: "ip-geolocation-accuracy-explained",
    title: "How Accurate Is IP Geolocation? What Developers Need to Know",
    description:
      "Understand the accuracy limitations of IP-based geolocation, why results vary by region, and how VPNs, proxies, and mobile networks affect location detection.",
    tag: "Deep Dive",
    date: "Feb 5, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ip-geolocation-python-tutorial",
    title: "IP Geolocation in Python: Get Location from IP Address (2026 Guide)",
    description:
      "Learn how to get geolocation data from IP addresses in Python using a free API. Covers requests, Flask, Django middleware, caching, and pandas analysis.",
    tag: "Tutorial",
    date: "Feb 4, 2026",
    readTime: "9 min read",
  },
  {
    slug: "geo-redirect-visitors-by-country",
    title: "How to Geo-Redirect Visitors by Country Using IP Geolocation",
    description:
      "Redirect website visitors to localized pages based on their country. Covers Next.js middleware, client-side JavaScript, and server-side approaches with best practices.",
    tag: "Guide",
    date: "Feb 3, 2026",
    readTime: "8 min read",
  },
  {
    slug: "what-is-my-ip-address-explained",
    title: "What Is My IP Address? How IP Addresses Work (Simple Explanation)",
    description:
      "Learn what an IP address is, how it works, the difference between IPv4 and IPv6, public vs private IPs, and how websites use your IP to detect your location.",
    tag: "Explainer",
    date: "Feb 2, 2026",
    readTime: "6 min read",
  },
  {
    slug: "detect-user-timezone-javascript",
    title: "How to Detect User Timezone in JavaScript (3 Methods Compared)",
    description:
      "Three ways to detect a user's timezone: Intl API, IP geolocation, and Date offset. Compare accuracy, reliability, and when to use each approach.",
    tag: "Tutorial",
    date: "Feb 1, 2026",
    readTime: "7 min read",
  },
  {
    slug: "ip-geolocation-gdpr-privacy-compliance",
    title: "IP Geolocation and GDPR: What Developers Need to Know About Privacy",
    description:
      "Is IP geolocation GDPR compliant? Understand how privacy laws affect IP-based location detection, what counts as personal data, and how to use geolocation APIs responsibly.",
    tag: "Guide",
    date: "Jan 30, 2026",
    readTime: "7 min read",
  },
  {
    slug: "ip-geolocation-fraud-detection-guide",
    title: "Using IP Geolocation for Fraud Detection: A Developer's Guide",
    description:
      "Use IP geolocation data to detect and prevent fraud. Covers location mismatch detection, velocity checks, impossible travel, and risk scoring with code examples.",
    tag: "Guide",
    date: "Jan 28, 2026",
    readTime: "8 min read",
  },
  {
    slug: "show-local-currency-pricing-by-ip",
    title: "How to Show Local Currency and Pricing Based on Visitor IP Location",
    description:
      "Display prices in your visitor's local currency using IP geolocation. Covers country-to-currency mapping, Intl.NumberFormat, and purchasing power parity pricing.",
    tag: "Tutorial",
    date: "Jan 26, 2026",
    readTime: "7 min read",
  },
  {
    slug: "ip-geolocation-php-tutorial",
    title: "IP Geolocation in PHP: Get Visitor Location (Free API Tutorial)",
    description:
      "Detect visitor location by IP in PHP using a free API. Covers file_get_contents, cURL, Laravel integration, WordPress, and caching strategies.",
    tag: "Tutorial",
    date: "Jan 24, 2026",
    readTime: "8 min read",
  },
  {
    slug: "self-host-ip-geolocation-api-vercel",
    title: "How to Self-Host Your Own Free IP Geolocation API on Vercel",
    description:
      "Deploy your own IP geolocation API for free on Vercel in under 5 minutes. Full control, no rate limits, no third-party dependencies.",
    tag: "Guide",
    date: "Jan 22, 2026",
    readTime: "6 min read",
  },
  {
    slug: "ip-geolocation-go-golang-tutorial",
    title: "IP Geolocation in Go: Get Location from IP Address (Golang Tutorial)",
    description:
      "Get geolocation data from IP addresses in Go. Covers net/http, JSON parsing, Gin middleware, concurrent lookups, and caching patterns.",
    tag: "Tutorial",
    date: "Jan 20, 2026",
    readTime: "7 min read",
  },
  {
    slug: "ipv4-vs-ipv6-differences-explained",
    title: "IPv4 vs IPv6: Key Differences Developers Should Know (2026)",
    description:
      "Understand the differences between IPv4 and IPv6 — address format, adoption rates, NAT, geolocation accuracy, and what it means for developers.",
    tag: "Explainer",
    date: "Jan 18, 2026",
    readTime: "6 min read",
  },
];

export default function BlogIndex() {
  return (
    <div className="blog-container">
      <header className="blog-header">
        <Link href="/">
          <Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} />
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <a
            href="https://github.com/kamero-ai/geo-location-api"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <ThemeToggle />
        </nav>
      </header>

      <section className="blog-hero">
        <h1>Blog</h1>
        <p>
          Guides, tutorials, and insights on IP geolocation for developers.
          Learn how to build location-aware applications with free APIs.
        </p>
      </section>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <span className="blog-card-tag">{post.tag}</span>
            <h2>{post.title}</h2>
            <p>{post.description}</p>
            <div className="blog-card-meta">
              <span>{post.date} · {post.readTime}</span>
              <span className="blog-card-read">Read →</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="blog-footer">
        <p>© 2026 Kamero AI · MIT License</p>
      </footer>
    </div>
  );
}
