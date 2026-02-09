import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Geo-Block: Restrict Website Access by Country Using IP",
  description:
    "Learn how to restrict or block website access based on visitor country using IP geolocation. Covers Next.js middleware, Express, Nginx, and Cloudflare approaches.",
  keywords: ["geo blocking", "block country ip", "restrict access by country", "ip geo block website", "country based access control", "geo fencing website", "block ip by location", "nextjs geo block middleware", "nginx geo block"],
  alternates: { canonical: "https://geo.kamero.ai/blog/geo-blocking-restrict-access-by-country" },
  openGraph: { title: "How to Geo-Block Website Access by Country", description: "Restrict website access based on visitor country using IP geolocation.", url: "https://geo.kamero.ai/blog/geo-blocking-restrict-access-by-country", type: "article", publishedTime: "2026-01-14T00:00:00Z" },
};

export default function GeoBlockPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>How to Geo-Block: Restrict Website Access by Country</h1>
        <p className="post-meta">Jan 14, 2026 · 8 min read</p>

        <p>Geo-blocking restricts access to your website or application based on the visitor&apos;s geographic location. It&apos;s commonly used for licensing compliance, regulatory requirements, or security. Here&apos;s how to implement it at different layers of your stack.</p>

        <h2>Why Geo-Block?</h2>
        <ul>
          <li><strong>Licensing</strong> — Streaming services restrict content by region due to distribution rights</li>
          <li><strong>Compliance</strong> — Financial services may be prohibited from serving certain jurisdictions</li>
          <li><strong>Security</strong> — Block regions with high fraud rates as a defense layer</li>
          <li><strong>Sanctions</strong> — Legal requirements to block access from sanctioned countries</li>
        </ul>

        <h2>Approach 1: Next.js Middleware (Edge)</h2>
        <p>Runs before the page loads, at the edge — zero latency for blocked users:</p>
        <pre><code>{`// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_COUNTRIES = new Set(["XX", "YY", "ZZ"]);

export function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country") || "";

  if (BLOCKED_COUNTRIES.has(country)) {
    return NextResponse.rewrite(
      new URL("/blocked", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|blocked|favicon.ico).*)"],
};`}</code></pre>

        <h2>Approach 2: Express Middleware</h2>
        <pre><code>{`const BLOCKED = new Set(["XX", "YY", "ZZ"]);

app.use(async (req, res, next) => {
  try {
    const geo = await fetch("https://geo.kamero.ai/api/geo")
      .then(r => r.json());

    if (BLOCKED.has(geo.country)) {
      return res.status(403).json({
        error: "Access restricted in your region",
        country: geo.country,
      });
    }

    req.geo = geo;
    next();
  } catch {
    next(); // Fail open — don't block if API is unreachable
  }
});`}</code></pre>

        <h2>Approach 3: Client-Side (Soft Block)</h2>
        <p>For a softer approach that shows a message instead of a hard block:</p>
        <pre><code>{`async function checkAccess() {
  const { country } = await fetch(
    "https://geo.kamero.ai/api/geo"
  ).then(r => r.json());

  const blocked = ["XX", "YY", "ZZ"];

  if (blocked.includes(country)) {
    document.getElementById("app").innerHTML = \`
      <div class="blocked-message">
        <h1>Service Unavailable</h1>
        <p>This service is not available in your region.</p>
      </div>
    \`;
    return false;
  }
  return true;
}`}</code></pre>

        <h2>Approach 4: Allowlist (Opposite of Blocking)</h2>
        <p>Sometimes it&apos;s easier to define which countries CAN access your service:</p>
        <pre><code>{`const ALLOWED_COUNTRIES = new Set([
  "US", "CA", "GB", "DE", "FR", "AU", "JP",
]);

function isAllowed(country: string): boolean {
  return ALLOWED_COUNTRIES.has(country);
}`}</code></pre>

        <h2>Best Practices</h2>
        <ul>
          <li><strong>Fail open, not closed.</strong> If the geolocation API is unreachable, allow access rather than blocking everyone.</li>
          <li><strong>Show a clear message.</strong> Don&apos;t just show a 403 — explain why access is restricted and provide contact info.</li>
          <li><strong>Log blocked attempts.</strong> Track how many users are being blocked for monitoring and compliance auditing.</li>
          <li><strong>Consider VPN users.</strong> Geo-blocking is not foolproof — VPN users can bypass it. For strict compliance, combine with other verification methods.</li>
          <li><strong>Check legal requirements.</strong> Some jurisdictions require specific messaging or appeal processes when blocking access.</li>
        </ul>

        <h2>Creating a Blocked Page</h2>
        <pre><code>{`// app/blocked/page.tsx
export default function BlockedPage() {
  return (
    <main style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h1>Service Unavailable in Your Region</h1>
      <p>
        We're sorry, but this service is not currently available
        in your location due to regulatory requirements.
      </p>
      <p>
        If you believe this is an error, please contact{" "}
        <a href="mailto:support@example.com">support@example.com</a>
      </p>
    </main>
  );
}`}</code></pre>

        <div className="blog-post-cta">
          <h3>Get Visitor Country Instantly</h3>
          <p>Free API returns ISO country code with every request.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
