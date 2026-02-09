import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Geo-Redirect Visitors by Country Using IP Geolocation",
  description:
    "Learn how to redirect website visitors to localized pages based on their country using IP geolocation. Covers Next.js middleware, JavaScript client-side, and server-side approaches.",
  keywords: [
    "geo redirect by country",
    "redirect visitors by location",
    "ip based redirect",
    "geolocation redirect website",
    "country based redirect",
    "geo targeting redirect",
    "nextjs geo redirect middleware",
    "javascript redirect by country",
    "localize website by ip",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/geo-redirect-visitors-by-country" },
  openGraph: {
    title: "How to Geo-Redirect Visitors by Country",
    description: "Redirect website visitors to localized pages based on their IP location.",
    url: "https://geo.kamero.ai/blog/geo-redirect-visitors-by-country",
    type: "article",
    publishedTime: "2026-02-03T00:00:00Z",
  },
};

export default function GeoRedirectPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>How to Geo-Redirect Visitors by Country Using IP Geolocation</h1>
        <p className="post-meta">Feb 3, 2026 · 8 min read</p>

        <p>
          Geo-redirecting visitors to localized versions of your site is one of the most
          impactful things you can do for international users. A visitor from Germany
          landing on your English homepage might bounce — but redirect them to your German
          page and they&apos;re far more likely to engage.
        </p>
        <p>
          This guide covers three approaches: Next.js middleware (fastest), client-side
          JavaScript (simplest), and server-side (most flexible).
        </p>

        <h2>Approach 1: Next.js Middleware (Recommended)</h2>
        <p>
          If you&apos;re on Vercel, middleware runs at the edge before the page loads.
          This means zero flash of wrong content:
        </p>
        <pre><code>{`// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COUNTRY_ROUTES: Record<string, string> = {
  DE: "/de",
  FR: "/fr",
  ES: "/es",
  JP: "/ja",
  BR: "/pt",
};

export function middleware(request: NextRequest) {
  // Skip if already on a localized path
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/de") || pathname.startsWith("/fr") ||
      pathname.startsWith("/es") || pathname.startsWith("/ja") ||
      pathname.startsWith("/pt")) {
    return NextResponse.next();
  }

  // Skip if user has a locale preference cookie
  if (request.cookies.get("locale-preference")) {
    return NextResponse.next();
  }

  const country = request.headers.get("x-vercel-ip-country") || "";
  const redirectPath = COUNTRY_ROUTES[country];

  if (redirectPath && pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};`}</code></pre>

        <h2>Approach 2: Client-Side JavaScript</h2>
        <p>
          Works on any hosting provider. The tradeoff is a brief flash before redirect:
        </p>
        <pre><code>{`// Run this early in your page load
async function geoRedirect() {
  // Don't redirect if user chose a locale manually
  if (localStorage.getItem("locale-preference")) return;

  try {
    const { country } = await fetch(
      "https://geo.kamero.ai/api/geo"
    ).then(r => r.json());

    const routes = {
      DE: "/de",
      FR: "/fr",
      ES: "/es",
      JP: "/ja",
      BR: "/pt",
    };

    const target = routes[country];
    if (target && window.location.pathname === "/") {
      window.location.href = target;
    }
  } catch {
    // Silently fail — user stays on default page
  }
}

geoRedirect();`}</code></pre>

        <h2>Approach 3: Server-Side (Node.js / Express)</h2>
        <pre><code>{`// Express middleware
app.use(async (req, res, next) => {
  if (req.path !== "/" || req.cookies["locale-preference"]) {
    return next();
  }

  try {
    const response = await fetch("https://geo.kamero.ai/api/geo");
    const { country } = await response.json();

    const routes = { DE: "/de", FR: "/fr", ES: "/es" };
    if (routes[country]) {
      return res.redirect(302, routes[country]);
    }
  } catch {
    // Fall through to default
  }

  next();
});`}</code></pre>

        <h2>Best Practices for Geo-Redirects</h2>
        <ul>
          <li>
            <strong>Always let users override.</strong> Add a language/region picker and store
            the preference in a cookie. Never trap users in a locale they didn&apos;t choose.
          </li>
          <li>
            <strong>Use 302 (temporary) redirects, not 301.</strong> The same URL should serve
            different users differently, so search engines need to see the original URL.
          </li>
          <li>
            <strong>Don&apos;t redirect search engine bots.</strong> Check the User-Agent and
            skip redirects for Googlebot, Bingbot, etc. to avoid SEO issues.
          </li>
          <li>
            <strong>Set hreflang tags.</strong> Tell search engines about your localized pages
            so they can serve the right version in search results:
          </li>
        </ul>
        <pre><code>{`<link rel="alternate" hreflang="en" href="https://example.com/" />
<link rel="alternate" hreflang="de" href="https://example.com/de" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />`}</code></pre>

        <h2>Geo-Redirect vs Geo-Content</h2>
        <p>
          An alternative to redirecting is serving different content on the same URL based
          on location. This avoids the redirect latency and is simpler to implement:
        </p>
        <pre><code>{`// Server Component (Next.js on Vercel)
import { headers } from "next/headers";

const messages = {
  DE: { greeting: "Willkommen!", cta: "Jetzt starten" },
  FR: { greeting: "Bienvenue!", cta: "Commencer" },
  JP: { greeting: "ようこそ!", cta: "始める" },
  default: { greeting: "Welcome!", cta: "Get Started" },
};

export default async function Home() {
  const h = await headers();
  const country = h.get("x-vercel-ip-country") || "default";
  const msg = messages[country] || messages.default;

  return (
    <main>
      <h1>{msg.greeting}</h1>
      <button>{msg.cta}</button>
    </main>
  );
}`}</code></pre>
        <p>
          This approach works well for marketing pages where you want localized copy
          without maintaining separate URL structures.
        </p>

        <div className="blog-post-cta">
          <h3>Get Visitor Country Instantly</h3>
          <p>Free API, no key required. Works from any framework.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
