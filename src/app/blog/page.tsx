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
