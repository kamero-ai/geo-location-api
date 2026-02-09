import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Self-Host Your Own Free IP Geolocation API on Vercel",
  description:
    "Deploy your own IP geolocation API for free on Vercel in under 5 minutes. Full control, no rate limits, no third-party dependencies. Open source with MIT license.",
  keywords: [
    "self host geolocation api",
    "deploy ip api vercel",
    "free geolocation api self hosted",
    "own ip location api",
    "vercel geolocation headers",
    "open source geolocation api",
    "deploy geo api free",
    "vercel edge geolocation",
    "host your own ip api",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/self-host-ip-geolocation-api-vercel" },
  openGraph: {
    title: "Self-Host Your Own IP Geolocation API on Vercel",
    description: "Deploy a free, open-source IP geolocation API on Vercel in under 5 minutes.",
    url: "https://geo.kamero.ai/blog/self-host-ip-geolocation-api-vercel",
    type: "article",
    publishedTime: "2026-01-22T00:00:00Z",
  },
};

export default function SelfHostPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>How to Self-Host Your Own Free IP Geolocation API on Vercel</h1>
        <p className="post-meta">Jan 22, 2026 · 6 min read</p>

        <p>
          Third-party API dependencies are a risk. They can go down, change pricing, add
          rate limits, or shut down entirely. If IP geolocation is critical to your app,
          self-hosting gives you full control — and with Vercel, it&apos;s free.
        </p>

        <h2>Why Self-Host?</h2>
        <ul>
          <li><strong>Zero rate limits</strong> — Your instance, your rules</li>
          <li><strong>No API key management</strong> — One less secret to rotate</li>
          <li><strong>Privacy</strong> — User IPs never leave your infrastructure</li>
          <li><strong>Reliability</strong> — No dependency on a third-party service</li>
          <li><strong>Custom domain</strong> — <code>geo.yourdomain.com</code></li>
          <li><strong>Free</strong> — Vercel&apos;s free tier is generous for API usage</li>
        </ul>

        <h2>How It Works</h2>
        <p>
          Vercel&apos;s Edge Network automatically adds geolocation headers to every
          incoming request. These headers contain the visitor&apos;s city, country,
          coordinates, timezone, and more — derived from their IP address at the edge.
        </p>
        <p>
          The Kamero Geo API simply reads these headers and returns them as JSON. There&apos;s
          no external database, no API calls to third parties, and no IP processing on your
          end. Vercel does all the heavy lifting.
        </p>
        <pre><code>{`// This is the entire API — it just reads Vercel headers
import { geolocation, ipAddress } from "@vercel/functions";

export async function GET(request) {
  const geo = geolocation(request);
  const ip = ipAddress(request);

  return Response.json({
    ip,
    city: geo.city,
    country: geo.country,
    countryRegion: geo.countryRegion,
    latitude: geo.latitude,
    longitude: geo.longitude,
    // ... more fields from headers
  });
}`}</code></pre>

        <h2>Option 1: One-Click Deploy (30 Seconds)</h2>
        <p>The fastest way — click the button and Vercel handles everything:</p>
        <p>
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api"
            target="_blank"
            rel="noopener noreferrer"
            style={{fontWeight: 600}}
          >
            → Deploy to Vercel (one click)
          </a>
        </p>
        <p>This will:</p>
        <ol>
          <li>Fork the repository to your GitHub account</li>
          <li>Create a new Vercel project</li>
          <li>Deploy it automatically</li>
          <li>Give you a live URL like <code>geo-location-api-xyz.vercel.app</code></li>
        </ol>

        <h2>Option 2: Manual Deploy (5 Minutes)</h2>
        <pre><code>{`# Clone the repository
git clone https://github.com/kamero-ai/geo-location-api.git
cd geo-location-api

# Install dependencies
npm install
# or: bun install

# Deploy to Vercel
npx vercel deploy --prod`}</code></pre>

        <h2>Option 3: Fork and Customize</h2>
        <p>
          Fork the repo on GitHub, then customize the API to your needs:
        </p>
        <pre><code>{`// Add custom fields, filtering, or authentication
export async function GET(request) {
  const geo = geolocation(request);
  const ip = ipAddress(request);

  // Add your custom logic
  const isEU = ["AT","BE","BG","HR","CY","CZ","DK","EE",
    "FI","FR","DE","GR","HU","IE","IT","LV","LT","LU",
    "MT","NL","PL","PT","RO","SK","SI","ES","SE"
  ].includes(geo.country || "");

  return Response.json({
    ip,
    city: geo.city,
    country: geo.country,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: request.headers.get("x-vercel-ip-timezone"),
    isEU, // Custom field!
  });
}`}</code></pre>

        <h2>Adding a Custom Domain</h2>
        <ol>
          <li>Go to your Vercel project → Settings → Domains</li>
          <li>Add your domain (e.g., <code>geo.yourdomain.com</code>)</li>
          <li>Add the DNS records Vercel provides (CNAME or A record)</li>
          <li>Wait for DNS propagation (usually minutes)</li>
        </ol>
        <p>Your API is now available at:</p>
        <pre><code>{`https://geo.yourdomain.com/api/geo`}</code></pre>

        <h2>Vercel Free Tier Limits</h2>
        <p>
          Vercel&apos;s Hobby (free) plan is generous for API usage:
        </p>
        <table>
          <thead>
            <tr><th>Resource</th><th>Free Tier Limit</th></tr>
          </thead>
          <tbody>
            <tr><td>Serverless Function Invocations</td><td>100,000/month</td></tr>
            <tr><td>Bandwidth</td><td>100 GB/month</td></tr>
            <tr><td>Edge Middleware Invocations</td><td>1,000,000/month</td></tr>
            <tr><td>Deployments</td><td>Unlimited</td></tr>
          </tbody>
        </table>
        <p>
          For most projects, this is more than enough. If you outgrow it, Vercel&apos;s
          Pro plan ($20/month) significantly increases these limits.
        </p>

        <h2>Monitoring Your Instance</h2>
        <p>
          Vercel provides built-in analytics and logs. You can also add a simple health
          check endpoint:
        </p>
        <pre><code>{`// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}`}</code></pre>

        <div className="blog-post-cta">
          <h3>Deploy in 30 Seconds</h3>
          <p>One click. Free forever. Full control.</p>
          <a href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api" className="cta-btn" target="_blank" rel="noopener noreferrer">Deploy to Vercel →</a>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
