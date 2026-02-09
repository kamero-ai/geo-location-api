import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Test IP Geolocation APIs with cURL (Quick Examples)",
  description:
    "Learn how to test and debug IP geolocation APIs using cURL from the command line. Covers basic requests, JSON parsing with jq, headers, response times, and scripting.",
  keywords: ["curl ip geolocation", "test geolocation api curl", "curl ip lookup", "curl get location", "api testing curl", "curl json ip address", "command line ip location", "curl jq geolocation"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-curl-api-testing" },
  openGraph: { title: "Test IP Geolocation APIs with cURL", description: "Quick cURL examples for testing IP geolocation APIs.", url: "https://geo.kamero.ai/blog/ip-geolocation-curl-api-testing", type: "article", publishedTime: "2026-01-16T00:00:00Z" },
};

export default function CurlPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>How to Test IP Geolocation APIs with cURL</h1>
        <p className="post-meta">Jan 16, 2026 · 5 min read</p>

        <p>cURL is the fastest way to test any API from your terminal. Here&apos;s how to use it effectively with IP geolocation endpoints.</p>

        <h2>Basic Request</h2>
        <pre><code>{`curl https://geo.kamero.ai/api/geo`}</code></pre>
        <p>Returns raw JSON with your IP, city, country, coordinates, timezone, and more.</p>

        <h2>Pretty Print with jq</h2>
        <pre><code>{`curl -s https://geo.kamero.ai/api/geo | jq .`}</code></pre>
        <p>The <code>-s</code> flag silences the progress bar, and <code>jq .</code> formats the JSON output with colors and indentation.</p>

        <h2>Extract Specific Fields</h2>
        <pre><code>{`# Get just the city
curl -s https://geo.kamero.ai/api/geo | jq -r '.city'

# Get city and country
curl -s https://geo.kamero.ai/api/geo | jq -r '"\(.city), \(.country)"'

# Get coordinates
curl -s https://geo.kamero.ai/api/geo | jq '{lat: .latitude, lng: .longitude}'`}</code></pre>

        <h2>Measure Response Time</h2>
        <pre><code>{`# Total time
curl -s -o /dev/null -w "Total: %{time_total}s\\n" https://geo.kamero.ai/api/geo

# Detailed timing breakdown
curl -s -o /dev/null -w "DNS: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTLS: %{time_appconnect}s\\nFirst byte: %{time_starttransfer}s\\nTotal: %{time_total}s\\n" https://geo.kamero.ai/api/geo`}</code></pre>

        <h2>Check Response Headers</h2>
        <pre><code>{`curl -I https://geo.kamero.ai/api/geo`}</code></pre>
        <p>This shows the HTTP headers including CORS headers, content type, and cache directives.</p>

        <h2>Test CORS Preflight</h2>
        <pre><code>{`curl -X OPTIONS https://geo.kamero.ai/api/geo \\
  -H "Origin: https://example.com" \\
  -H "Access-Control-Request-Method: GET" \\
  -v 2>&1 | grep -i "access-control"`}</code></pre>

        <h2>Save Response to File</h2>
        <pre><code>{`# Save JSON response
curl -s https://geo.kamero.ai/api/geo -o location.json

# Append to log with timestamp
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $(curl -s https://geo.kamero.ai/api/geo)" >> geo_log.txt`}</code></pre>

        <h2>Loop for Monitoring</h2>
        <pre><code>{`# Check every 30 seconds
while true; do
  echo "$(date): $(curl -s https://geo.kamero.ai/api/geo | jq -r '.city')"
  sleep 30
done`}</code></pre>

        <h2>Compare Multiple APIs</h2>
        <pre><code>{`# Time multiple geolocation APIs
for url in \\
  "https://geo.kamero.ai/api/geo" \\
  "https://ipapi.co/json/" \\
  "http://ip-api.com/json/"; do
  time=$(curl -s -o /dev/null -w "%{time_total}" "$url")
  echo "$url → $\{time}s"
done`}</code></pre>

        <h2>Use in Shell Scripts</h2>
        <pre><code>{`#!/bin/bash
# Get visitor country and act on it
COUNTRY=$(curl -s https://geo.kamero.ai/api/geo | jq -r '.country')

case $COUNTRY in
  US) echo "Connecting to US server..." ;;
  EU|DE|FR|GB) echo "Connecting to EU server..." ;;
  *) echo "Connecting to default server..." ;;
esac`}</code></pre>

        <div className="blog-post-cta">
          <h3>Try It Now</h3>
          <p>Open your terminal and run: <code>curl https://geo.kamero.ai/api/geo</code></p>
          <Link href="/docs#curl" className="cta-btn">More cURL Examples →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
