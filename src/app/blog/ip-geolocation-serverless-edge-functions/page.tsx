import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in Serverless & Edge Functions (Vercel, Cloudflare, AWS Lambda)",
  description:
    "Use IP geolocation in serverless and edge functions. Covers Vercel Edge Middleware, Cloudflare Workers, AWS Lambda@Edge, and Deno Deploy with practical examples.",
  keywords: ["serverless geolocation", "edge function ip location", "vercel edge geolocation", "cloudflare workers ip", "aws lambda geolocation", "edge middleware location", "serverless ip lookup", "deno deploy geolocation"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-serverless-edge-functions" },
  openGraph: { title: "IP Geolocation in Serverless & Edge Functions", description: "Use geolocation in Vercel, Cloudflare, AWS Lambda, and Deno Deploy edge functions.", url: "https://geo.kamero.ai/blog/ip-geolocation-serverless-edge-functions", type: "article", publishedTime: "2026-01-08T00:00:00Z" },
};

export default function ServerlessPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>IP Geolocation in Serverless &amp; Edge Functions</h1>
        <p className="post-meta">Jan 8, 2026 · 9 min read</p>

        <p>Edge and serverless functions run close to your users, making them ideal for location-based logic. Many platforms provide built-in geo headers, and for those that don&apos;t, a quick API call fills the gap. Here&apos;s how to use IP geolocation across the major serverless platforms.</p>

        <h2>Vercel Edge Middleware</h2>
        <p>Vercel injects geolocation headers automatically on Edge Runtime. No external API call needed.</p>
        <pre><code>{`// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const country = request.geo?.country || "US";
  const city = request.geo?.city || "Unknown";
  const latitude = request.geo?.latitude;
  const longitude = request.geo?.longitude;

  // Add geo data to request headers
  const response = NextResponse.next();
  response.headers.set("x-geo-country", country);
  response.headers.set("x-geo-city", city);

  // Geo-based routing
  if (country === "DE" || country === "AT") {
    const url = request.nextUrl.clone();
    url.pathname = "/de" + url.pathname;
    return NextResponse.rewrite(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};`}</code></pre>

        <h2>Vercel Serverless Function</h2>
        <pre><code>{`// app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Option 1: Use Vercel's built-in headers
  const country = request.headers.get("x-vercel-ip-country");
  const city = request.headers.get("x-vercel-ip-city");

  // Option 2: Call the geo API for full data
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  return NextResponse.json({
    vercelHeaders: { country, city },
    apiData: geo,
  });
}`}</code></pre>

        <h2>Cloudflare Workers</h2>
        <p>Cloudflare provides geo data through the <code>cf</code> object on every request.</p>
        <pre><code>{`export default {
  async fetch(request: Request): Promise<Response> {
    // Built-in Cloudflare geo data
    const cf = request.cf;
    const country = cf?.country || "Unknown";
    const city = cf?.city || "Unknown";
    const timezone = cf?.timezone || "UTC";
    const latitude = cf?.latitude;
    const longitude = cf?.longitude;

    // Use for routing decisions
    if (country === "CN") {
      return new Response("This content is not available",
        { status: 451 });
    }

    // Or enrich with external API for more data
    const geo = await fetch("https://geo.kamero.ai/api/geo")
      .then(r => r.json());

    return new Response(JSON.stringify({
      cfData: { country, city, timezone },
      apiData: geo,
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};`}</code></pre>

        <h2>AWS Lambda@Edge</h2>
        <pre><code>{`// Lambda@Edge viewer request function
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;

  // CloudFront provides country via headers
  const countryHeader =
    request.headers["cloudfront-viewer-country"];
  const country = countryHeader?.[0]?.value || "US";

  // For full geo data, call the API
  const https = require("https");
  const geo = await new Promise((resolve, reject) => {
    https.get("https://geo.kamero.ai/api/geo", (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(JSON.parse(data)));
    }).on("error", reject);
  });

  // Add geo headers for downstream processing
  request.headers["x-geo-city"] =
    [{ value: geo.city }];
  request.headers["x-geo-timezone"] =
    [{ value: geo.timezone }];

  return request;
};`}</code></pre>

        <h2>Deno Deploy</h2>
        <pre><code>{`Deno.serve(async (request: Request) => {
  // Deno Deploy doesn't have built-in geo,
  // so use the API
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  // Localized greeting
  const greetings: Record<string, string> = {
    JP: "こんにちは",
    ES: "¡Hola!",
    FR: "Bonjour",
    DE: "Hallo",
  };

  const greeting = greetings[geo.country] || "Hello";

  return new Response(JSON.stringify({
    greeting,
    location: \`\${geo.city}, \${geo.country}\`,
    timezone: geo.timezone,
  }), {
    headers: { "Content-Type": "application/json" },
  });
});`}</code></pre>

        <h2>Edge vs Serverless: When to Use Which</h2>
        <table>
          <thead>
            <tr><th>Feature</th><th>Edge Functions</th><th>Serverless Functions</th></tr>
          </thead>
          <tbody>
            <tr><td>Latency</td><td>~1-10ms (runs at CDN edge)</td><td>~50-200ms (regional)</td></tr>
            <tr><td>Built-in geo</td><td>Usually yes</td><td>Sometimes (via headers)</td></tr>
            <tr><td>Runtime</td><td>V8 isolates (limited APIs)</td><td>Full Node.js/Python/etc.</td></tr>
            <tr><td>Best for</td><td>Routing, redirects, A/B tests</td><td>API endpoints, heavy logic</td></tr>
            <tr><td>Cold starts</td><td>Near zero</td><td>100ms-several seconds</td></tr>
          </tbody>
        </table>

        <h2>Caching Geo Data at the Edge</h2>
        <pre><code>{`// Vercel Edge with Cache API
export async function middleware(request: NextRequest) {
  const cache = caches.default;
  const cacheKey = new Request(
    "https://geo.kamero.ai/api/geo",
    { method: "GET" }
  );

  let response = await cache.match(cacheKey);
  if (!response) {
    response = await fetch("https://geo.kamero.ai/api/geo");
    // Cache for 10 minutes
    const cached = new Response(response.body, response);
    cached.headers.set("Cache-Control", "max-age=600");
    await cache.put(cacheKey, cached);
  }

  const geo = await response.json();
  // Use geo data for routing...
}`}</code></pre>

        <h2>Key Takeaways</h2>
        <ul>
          <li>Vercel and Cloudflare provide built-in geo headers — use them when available</li>
          <li>For platforms without built-in geo, a quick API call adds minimal latency</li>
          <li>Edge functions are ideal for geo-routing and redirects</li>
          <li>Cache geo responses to avoid redundant lookups</li>
          <li>Always have a fallback for when geo detection fails</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Deploy Your Own</h3>
          <p>Self-host the geo API on Vercel for zero-latency edge geolocation.</p>
          <Link href="/blog/self-host-ip-geolocation-api-vercel" className="cta-btn">Self-Hosting Guide →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}