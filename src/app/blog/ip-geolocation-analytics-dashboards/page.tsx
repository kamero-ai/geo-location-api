import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "Build a Visitor Analytics Dashboard with IP Geolocation (2026 Guide)",
  description:
    "Build a real-time analytics dashboard that tracks visitor locations using IP geolocation. Covers data collection, storage, aggregation, and visualization with maps and charts.",
  keywords: ["ip geolocation analytics", "visitor location dashboard", "geolocation analytics dashboard", "ip tracking dashboard", "visitor geography analytics", "real-time location analytics", "ip geolocation map visualization", "visitor country analytics"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-analytics-dashboards" },
  openGraph: { title: "Build a Visitor Analytics Dashboard with IP Geolocation", description: "Track and visualize visitor locations with IP geolocation data.", url: "https://geo.kamero.ai/blog/ip-geolocation-analytics-dashboards", type: "article", publishedTime: "2026-01-06T00:00:00Z" },
};

export default function AnalyticsPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>Build a Visitor Analytics Dashboard with IP Geolocation</h1>
        <p className="post-meta">Jan 6, 2026 · 10 min read</p>

        <p>Understanding where your visitors come from is essential for making data-driven decisions about content, infrastructure, and marketing. This guide walks through building a lightweight analytics dashboard that tracks visitor geography using IP geolocation — no third-party analytics service required.</p>

        <h2>Architecture Overview</h2>
        <p>The system has three parts:</p>
        <ol>
          <li>A tracking endpoint that captures visitor geo data on each page view</li>
          <li>A storage layer (database or file) for the collected data</li>
          <li>A dashboard that aggregates and visualizes the data</li>
        </ol>

        <h2>Step 1: Collect Geo Data on Page View</h2>
        <pre><code>{`// app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  const event = {
    timestamp: new Date().toISOString(),
    path: request.headers.get("referer") || "/",
    ip: geo.ip,
    city: geo.city,
    country: geo.country,
    continent: geo.continent,
    timezone: geo.timezone,
    latitude: parseFloat(geo.latitude),
    longitude: parseFloat(geo.longitude),
  };

  // Store the event (see storage options below)
  await storeEvent(event);

  return NextResponse.json({ ok: true });
}`}</code></pre>

        <h2>Step 2: Client-Side Tracking Snippet</h2>
        <pre><code>{`// components/Analytics.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire and forget — don't block rendering
    fetch("/api/track", {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}

// Add to layout.tsx:
// <Analytics />`}</code></pre>

        <h2>Step 3: Storage Options</h2>
        <h3>Option A: SQLite (Simple, Self-Contained)</h3>
        <pre><code>{`import Database from "better-sqlite3";

const db = new Database("analytics.db");
db.exec(\`
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    path TEXT,
    ip TEXT,
    city TEXT,
    country TEXT,
    continent TEXT,
    timezone TEXT,
    latitude REAL,
    longitude REAL
  )
\`);

async function storeEvent(event: PageView) {
  db.prepare(\`
    INSERT INTO page_views
    (timestamp, path, ip, city, country,
     continent, timezone, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  \`).run(
    event.timestamp, event.path, event.ip,
    event.city, event.country, event.continent,
    event.timezone, event.latitude, event.longitude
  );
}`}</code></pre>

        <h3>Option B: JSON File (Zero Dependencies)</h3>
        <pre><code>{`import { appendFile } from "fs/promises";

async function storeEvent(event: PageView) {
  await appendFile(
    "analytics.jsonl",
    JSON.stringify(event) + "\\n"
  );
}`}</code></pre>

        <h2>Step 4: Aggregation Queries</h2>
        <pre><code>{`// Top countries
function getTopCountries(days = 30) {
  return db.prepare(\`
    SELECT country, COUNT(*) as views
    FROM page_views
    WHERE timestamp > datetime('now', ?)
    GROUP BY country
    ORDER BY views DESC
    LIMIT 20
  \`).all(\`-\${days} days\`);
}

// Views by hour (for timezone analysis)
function getViewsByHour() {
  return db.prepare(\`
    SELECT strftime('%H', timestamp) as hour,
           COUNT(*) as views
    FROM page_views
    WHERE timestamp > datetime('now', '-7 days')
    GROUP BY hour
    ORDER BY hour
  \`).all();
}

// Unique visitors by city
function getTopCities(limit = 50) {
  return db.prepare(\`
    SELECT city, country,
           COUNT(DISTINCT ip) as unique_visitors,
           COUNT(*) as total_views
    FROM page_views
    WHERE timestamp > datetime('now', '-30 days')
    GROUP BY city, country
    ORDER BY unique_visitors DESC
    LIMIT ?
  \`).all(limit);
}`}</code></pre>

        <h2>Step 5: Dashboard API</h2>
        <pre><code>{`// app/api/analytics/route.ts
export async function GET() {
  const data = {
    topCountries: getTopCountries(),
    topCities: getTopCities(20),
    viewsByHour: getViewsByHour(),
    totalViews: db.prepare(
      "SELECT COUNT(*) as count FROM page_views"
    ).get(),
    uniqueVisitors: db.prepare(
      "SELECT COUNT(DISTINCT ip) as count FROM page_views"
    ).get(),
  };

  return NextResponse.json(data);
}`}</code></pre>

        <h2>Step 6: Visualize with a Map</h2>
        <pre><code>{`"use client";
import { useEffect, useState } from "react";

interface CityData {
  city: string;
  country: string;
  unique_visitors: number;
  latitude: number;
  longitude: number;
}

export function VisitorMap() {
  const [cities, setCities] = useState<CityData[]>([]);

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => setCities(d.topCities));
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 1000 500" className="world-map">
        {/* World map paths here */}
        {cities.map((city, i) => {
          // Convert lat/lng to SVG coordinates
          const x = ((city.longitude + 180) / 360) * 1000;
          const y = ((90 - city.latitude) / 180) * 500;
          const r = Math.min(
            Math.sqrt(city.unique_visitors) * 2, 20
          );

          return (
            <circle
              key={i}
              cx={x} cy={y} r={r}
              fill="rgba(59, 130, 246, 0.6)"
              stroke="rgba(59, 130, 246, 0.9)"
              strokeWidth={1}
            >
              <title>
                {\`\${city.city}, \${city.country}: \${city.unique_visitors} visitors\`}
              </title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}`}</code></pre>

        <h2>Step 7: Country Bar Chart</h2>
        <pre><code>{`function CountryChart({
  data
}: {
  data: { country: string; views: number }[]
}) {
  const max = Math.max(...data.map(d => d.views));

  return (
    <div className="chart">
      {data.slice(0, 10).map((item) => (
        <div key={item.country} className="chart-row">
          <span className="chart-label">
            {item.country}
          </span>
          <div className="chart-bar-container">
            <div
              className="chart-bar"
              style={{
                width: \`\${(item.views / max) * 100}%\`
              }}
            />
          </div>
          <span className="chart-value">
            {item.views.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}`}</code></pre>

        <h2>Privacy Considerations</h2>
        <ul>
          <li>Hash or truncate IP addresses before storage to protect privacy</li>
          <li>Aggregate data at the city level rather than storing exact coordinates</li>
          <li>Add a retention policy — delete raw data after 90 days</li>
          <li>Respect Do Not Track headers and cookie consent preferences</li>
          <li>See our <Link href="/blog/ip-geolocation-gdpr-privacy-compliance">GDPR compliance guide</Link> for more details</li>
        </ul>

        <h2>Key Takeaways</h2>
        <ul>
          <li>IP geolocation gives you visitor geography without third-party analytics</li>
          <li>SQLite is a solid choice for self-hosted analytics storage</li>
          <li>Aggregate data server-side to keep dashboards fast</li>
          <li>Always consider privacy — hash IPs and set retention policies</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Start Tracking</h3>
          <p>Get visitor location data with a single API call — free, no key required.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}