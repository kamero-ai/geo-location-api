import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Get User Location by IP Address in JavaScript (2026 Guide)",
  description:
    "Step-by-step tutorial on detecting visitor location using a free IP geolocation API in JavaScript. Covers fetch API, async/await, error handling, React hooks, and Next.js server-side usage.",
  keywords: [
    "get user location javascript",
    "ip address location javascript",
    "javascript geolocation api",
    "detect user country javascript",
    "ip to location javascript",
    "fetch user location by ip",
    "react geolocation hook",
    "nextjs ip geolocation",
    "javascript get visitor city",
    "free ip lookup javascript",
  ],
  alternates: {
    canonical: "https://geo.kamero.ai/blog/how-to-get-user-location-by-ip-javascript",
  },
  openGraph: {
    title: "How to Get User Location by IP in JavaScript (2026)",
    description:
      "Complete tutorial on IP-based geolocation in JavaScript with code examples.",
    url: "https://geo.kamero.ai/blog/how-to-get-user-location-by-ip-javascript",
    type: "article",
    publishedTime: "2026-02-08T00:00:00Z",
  },
};

export default function JavaScriptTutorialPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/">
          <Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} />
        </Link>
        <nav className="blog-post-nav">
          <Link href="/blog">Blog</Link>
          <Link href="/docs">Docs</Link>
          <ThemeToggle />
        </nav>
      </header>

      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>How to Get User Location by IP Address in JavaScript</h1>
        <p className="post-meta">Feb 8, 2026 · 10 min read</p>

        <p>
          Detecting a visitor&apos;s location is one of the most common requirements in web
          development. Whether you&apos;re personalizing content, setting default timezones,
          or showing localized pricing, IP geolocation gives you an approximate location
          without asking for browser permissions.
        </p>
        <p>
          This guide walks through every approach — from a simple fetch call to production-ready
          React hooks and Next.js server-side patterns.
        </p>

        <h2>The Basics: Fetch API</h2>
        <p>
          The simplest way to get a user&apos;s location by IP is a single <code>fetch</code> call
          to a geolocation API. No API key, no SDK, no setup:
        </p>
        <pre><code>{`const response = await fetch("https://geo.kamero.ai/api/geo");
const location = await response.json();

console.log(location.city);      // "San Francisco"
console.log(location.country);   // "US"
console.log(location.timezone);  // "America/Los_Angeles"
console.log(location.latitude);  // "37.7749"
console.log(location.longitude); // "-122.4194"`}</code></pre>
        <p>
          The API returns 10 data points: <code>ip</code>, <code>city</code>, <code>country</code>,
          {" "}<code>countryRegion</code>, <code>continent</code>, <code>latitude</code>,
          {" "}<code>longitude</code>, <code>timezone</code>, <code>postalCode</code>, and <code>region</code>.
        </p>

        <h2>With Error Handling</h2>
        <p>
          In production, you should always handle network failures and unexpected responses:
        </p>
        <pre><code>{`async function getUserLocation() {
  try {
    const res = await fetch("https://geo.kamero.ai/api/geo");
    if (!res.ok) {
      throw new Error(\`HTTP \${res.status}\`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to get location:", error);
    return null;
  }
}

const location = await getUserLocation();
if (location?.city) {
  console.log(\`Welcome from \${location.city}, \${location.country}!\`);
}`}</code></pre>

        <h2>React Hook: useGeolocation</h2>
        <p>
          If you&apos;re building with React, a custom hook keeps your components clean:
        </p>
        <pre><code>{`import { useState, useEffect } from "react";

interface GeoData {
  ip: string;
  city: string;
  country: string;
  countryRegion: string;
  continent: string;
  latitude: string;
  longitude: string;
  timezone: string;
  postalCode: string;
  region: string;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://geo.kamero.ai/api/geo")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setLocation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { location, loading, error };
}`}</code></pre>
        <p>Then use it in any component:</p>
        <pre><code>{`function WelcomeBanner() {
  const { location, loading } = useGeolocation();

  if (loading) return <p>Loading...</p>;
  if (!location) return null;

  return (
    <p>
      Welcome from {location.city}, {location.country}!
    </p>
  );
}`}</code></pre>

        <h2>Next.js: Server-Side Geolocation</h2>
        <p>
          In Next.js, you can detect location on the server using Vercel&apos;s built-in
          geolocation headers. This avoids an extra API call entirely:
        </p>
        <pre><code>{`// app/page.tsx (Server Component)
import { headers } from "next/headers";

export default async function Page() {
  const headerList = await headers();
  const city = headerList.get("x-vercel-ip-city") || "Unknown";
  const country = headerList.get("x-vercel-ip-country") || "Unknown";

  return <h1>Hello from {city}, {country}!</h1>;
}`}</code></pre>
        <p>
          This only works when deployed to Vercel. For other hosting providers, use the
          client-side fetch approach or call the Kamero API from a server action.
        </p>

        <h2>Practical Example: Auto-Detect Timezone</h2>
        <p>
          One of the most useful applications is automatically displaying times in the
          visitor&apos;s timezone:
        </p>
        <pre><code>{`async function getVisitorTimezone() {
  const res = await fetch("https://geo.kamero.ai/api/geo");
  const { timezone } = await res.json();
  return timezone; // e.g., "America/New_York"
}

// Format a date in the visitor's timezone
const tz = await getVisitorTimezone();
const formatted = new Date().toLocaleString("en-US", {
  timeZone: tz,
  dateStyle: "full",
  timeStyle: "short",
});
console.log(formatted);
// "Monday, February 9, 2026 at 3:45 PM"`}</code></pre>

        <h2>Practical Example: Show Localized Content</h2>
        <p>
          Redirect or display content based on the visitor&apos;s country:
        </p>
        <pre><code>{`const { country } = await getUserLocation();

const greetings = {
  US: "Hey there! 🇺🇸",
  GB: "Hello! 🇬🇧",
  DE: "Hallo! 🇩🇪",
  JP: "こんにちは! 🇯🇵",
  IN: "नमस्ते! 🇮🇳",
};

const greeting = greetings[country] || "Welcome! 🌍";`}</code></pre>

        <h2>IP Geolocation vs Browser Geolocation</h2>
        <p>
          It&apos;s worth understanding the difference between these two approaches:
        </p>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>IP Geolocation</th>
              <th>Browser Geolocation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Permission Required</td>
              <td>No</td>
              <td>Yes (user prompt)</td>
            </tr>
            <tr>
              <td>Accuracy</td>
              <td>City-level (~5-25km)</td>
              <td>Street-level (~10m)</td>
            </tr>
            <tr>
              <td>Works Server-Side</td>
              <td>Yes</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Speed</td>
              <td>~50ms</td>
              <td>1-10 seconds</td>
            </tr>
            <tr>
              <td>VPN Affected</td>
              <td>Yes</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Use Case</td>
              <td>Personalization, analytics</td>
              <td>Maps, navigation, delivery</td>
            </tr>
          </tbody>
        </table>
        <p>
          For most web applications, IP geolocation is the right choice because it&apos;s
          instant, requires no user interaction, and works on both client and server.
          Use browser geolocation only when you need precise coordinates (e.g., delivery apps).
        </p>

        <h2>Tips for Production</h2>
        <ul>
          <li>
            <strong>Cache the result</strong> — A visitor&apos;s IP location doesn&apos;t change
            during a session. Store it in state, context, or a cookie.
          </li>
          <li>
            <strong>Handle undefined fields</strong> — VPN users and some mobile networks may
            return incomplete data. Always provide fallbacks.
          </li>
          <li>
            <strong>Don&apos;t block rendering</strong> — Fetch location data asynchronously
            and progressively enhance the UI.
          </li>
          <li>
            <strong>Consider self-hosting</strong> — For high-traffic apps, deploy your own
            Kamero instance to Vercel for guaranteed availability.
          </li>
        </ul>

        <div className="blog-post-cta">
          <h3>Start Using Kamero Geo API</h3>
          <p>No API key. No rate limits. Just fetch and go.</p>
          <Link href="/docs" className="cta-btn">Read the Docs →</Link>
        </div>
      </article>

      <footer className="blog-footer">
        <p>© 2026 Kamero AI · MIT License</p>
      </footer>
    </div>
  );
}
