"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "./docs.css";

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="docs-container">
      <header className="docs-header">
        <Link href="/">
          <Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} />
        </Link>
        <nav className="docs-nav">
          <Link href="/">Home</Link>
          <a href="https://github.com/kamero-ai/geo-location-api" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </header>

      <main className="docs-main">
        <aside className="docs-sidebar">
          <nav>
            <h4>Getting Started</h4>
            <a href="#introduction">Introduction</a>
            <a href="#quick-start">Quick Start</a>
            <a href="#base-url">Base URL</a>
            
            <h4>API Reference</h4>
            <a href="#endpoint">Endpoint</a>
            <a href="#response">Response Format</a>
            <a href="#fields">Field Reference</a>
            
            <h4>Code Examples</h4>
            <a href="#javascript">JavaScript</a>
            <a href="#python">Python</a>
            <a href="#curl">cURL</a>
            <a href="#php">PHP</a>
            <a href="#go">Go</a>
            
            <h4>Self-Hosting</h4>
            <a href="#deploy-vercel">Deploy to Vercel</a>
            <a href="#local-dev">Local Development</a>
            <a href="#custom-domain">Custom Domain</a>
          </nav>
        </aside>

        <article className="docs-content">
          <h1>Kamero Geo Location API Documentation</h1>
          <p className="docs-intro">
            Free, open-source API to get user geolocation by IP address. No API key required. 
            Returns city, country, coordinates, and region data instantly.
          </p>

          <section id="introduction">
            <h2>Introduction</h2>
            <p>
              Kamero Geo Location API provides accurate geolocation data for any IP address using 
              Vercel&apos;s Edge Network. The API is completely free, requires no authentication, 
              and has no rate limits.
            </p>
            <div className="info-box">
              <strong>Key Features:</strong>
              <ul>
                <li>No API key required</li>
                <li>No rate limits</li>
                <li>Sub-50ms response times globally</li>
                <li>100% free and open source</li>
                <li>CORS enabled for all origins</li>
              </ul>
            </div>
          </section>

          <section id="quick-start">
            <h2>Quick Start</h2>
            <p>Get user location with a single HTTP request:</p>
            <CodeBlock
              id="quick"
              code="curl https://geo.kamero.ai/api/geo"
              language="bash"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="base-url">
            <h2>Base URL</h2>
            <p>All API requests should be made to:</p>
            <CodeBlock
              id="base"
              code="https://geo.kamero.ai"
              language="text"
              copied={copied}
              onCopy={copy}
            />
            <p>If you&apos;re self-hosting, replace with your deployment URL.</p>
          </section>

          <section id="endpoint">
            <h2>API Endpoint</h2>
            <div className="endpoint-card">
              <span className="method">GET</span>
              <code>/api/geo</code>
            </div>
            <p>
              Returns geolocation data for the requesting client&apos;s IP address. 
              The location is determined by Vercel&apos;s Edge Network based on the 
              incoming request headers.
            </p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Required</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="table-note">No parameters required</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="response">
            <h2>Response Format</h2>
            <p>The API returns JSON with the following structure:</p>
            <CodeBlock
              id="response"
              code={`{
  "city": "San Francisco",
  "country": "US",
  "countryRegion": "CA",
  "latitude": "37.7749",
  "longitude": "-122.4194",
  "region": "sfo1"
}`}
              language="json"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="fields">
            <h2>Field Reference</h2>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>city</code></td>
                  <td>string | undefined</td>
                  <td>City name of the visitor</td>
                </tr>
                <tr>
                  <td><code>country</code></td>
                  <td>string | undefined</td>
                  <td>ISO 3166-1 alpha-2 country code (e.g., &quot;US&quot;, &quot;GB&quot;, &quot;IN&quot;)</td>
                </tr>
                <tr>
                  <td><code>countryRegion</code></td>
                  <td>string | undefined</td>
                  <td>ISO 3166-2 region/state code (e.g., &quot;CA&quot; for California)</td>
                </tr>
                <tr>
                  <td><code>latitude</code></td>
                  <td>string | undefined</td>
                  <td>Latitude coordinate as string</td>
                </tr>
                <tr>
                  <td><code>longitude</code></td>
                  <td>string | undefined</td>
                  <td>Longitude coordinate as string</td>
                </tr>
                <tr>
                  <td><code>region</code></td>
                  <td>string | undefined</td>
                  <td>Vercel Edge Network region that served the request</td>
                </tr>
              </tbody>
            </table>
            <div className="warning-box">
              <strong>Note:</strong> All fields may return <code>undefined</code> if geolocation 
              cannot be determined (e.g., VPN users, private networks, or local development).
            </div>
          </section>

          <section id="javascript">
            <h2>JavaScript / TypeScript</h2>
            <h3>Fetch API</h3>
            <CodeBlock
              id="js-fetch"
              code={`// Get user location
const response = await fetch("https://geo.kamero.ai/api/geo");
const location = await response.json();

console.log(location.city);    // "San Francisco"
console.log(location.country); // "US"`}
              language="javascript"
              copied={copied}
              onCopy={copy}
            />
            
            <h3>With Error Handling</h3>
            <CodeBlock
              id="js-error"
              code={`async function getUserLocation() {
  try {
    const res = await fetch("https://geo.kamero.ai/api/geo");
    if (!res.ok) throw new Error("Failed to fetch location");
    return await res.json();
  } catch (error) {
    console.error("Geolocation error:", error);
    return null;
  }
}

const location = await getUserLocation();
if (location?.city) {
  console.log(\`Welcome from \${location.city}, \${location.country}!\`);
}`}
              language="javascript"
              copied={copied}
              onCopy={copy}
            />

            <h3>React Hook</h3>
            <CodeBlock
              id="js-react"
              code={`import { useState, useEffect } from "react";

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://geo.kamero.ai/api/geo")
      .then(res => res.json())
      .then(setLocation)
      .finally(() => setLoading(false));
  }, []);

  return { location, loading };
}

// Usage
function MyComponent() {
  const { location, loading } = useGeolocation();
  
  if (loading) return <p>Loading...</p>;
  return <p>Hello from {location?.city}!</p>;
}`}
              language="javascript"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="python">
            <h2>Python</h2>
            <CodeBlock
              id="python"
              code={`import requests

response = requests.get("https://geo.kamero.ai/api/geo")
location = response.json()

print(f"City: {location.get('city')}")
print(f"Country: {location.get('country')}")
print(f"Coordinates: {location.get('latitude')}, {location.get('longitude')}")`}
              language="python"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="curl">
            <h2>cURL</h2>
            <CodeBlock
              id="curl"
              code={`# Basic request
curl https://geo.kamero.ai/api/geo

# Pretty print JSON
curl -s https://geo.kamero.ai/api/geo | jq

# With headers
curl -H "Accept: application/json" https://geo.kamero.ai/api/geo`}
              language="bash"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="php">
            <h2>PHP</h2>
            <CodeBlock
              id="php"
              code={`<?php
$response = file_get_contents("https://geo.kamero.ai/api/geo");
$location = json_decode($response, true);

echo "City: " . $location["city"] . "\\n";
echo "Country: " . $location["country"] . "\\n";
?>`}
              language="php"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="go">
            <h2>Go</h2>
            <CodeBlock
              id="go"
              code={`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type GeoLocation struct {
    City          string \`json:"city"\`
    Country       string \`json:"country"\`
    CountryRegion string \`json:"countryRegion"\`
    Latitude      string \`json:"latitude"\`
    Longitude     string \`json:"longitude"\`
    Region        string \`json:"region"\`
}

func main() {
    resp, _ := http.Get("https://geo.kamero.ai/api/geo")
    defer resp.Body.Close()

    var location GeoLocation
    json.NewDecoder(resp.Body).Decode(&location)

    fmt.Printf("City: %s, Country: %s\\n", location.City, location.Country)
}`}
              language="go"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="deploy-vercel">
            <h2>Deploy to Vercel (Recommended)</h2>
            <p>The fastest way to self-host is deploying to Vercel:</p>
            
            <h3>One-Click Deploy</h3>
            <p>
              <a 
                href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="deploy-btn"
              >
                Deploy with Vercel →
              </a>
            </p>

            <h3>Manual Deploy</h3>
            <CodeBlock
              id="deploy-manual"
              code={`# Clone the repository
git clone https://github.com/kamero-ai/geo-location-api.git
cd geo-location-api

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod`}
              language="bash"
              copied={copied}
              onCopy={copy}
            />
          </section>

          <section id="local-dev">
            <h2>Local Development</h2>
            <CodeBlock
              id="local"
              code={`# Clone repository
git clone https://github.com/kamero-ai/geo-location-api.git
cd geo-location-api

# Install dependencies (using Bun)
bun install

# Or using npm
npm install

# Start development server
bun run dev
# or
npm run dev`}
              language="bash"
              copied={copied}
              onCopy={copy}
            />
            <div className="warning-box">
              <strong>Important:</strong> Geolocation headers are only available when deployed 
              to Vercel. During local development, all location fields will return <code>undefined</code>.
            </div>
          </section>

          <section id="custom-domain">
            <h2>Custom Domain Setup</h2>
            <p>After deploying to Vercel, you can add a custom domain:</p>
            <ol>
              <li>Go to your Vercel project dashboard</li>
              <li>Navigate to Settings → Domains</li>
              <li>Add your custom domain (e.g., <code>geo.yourdomain.com</code>)</li>
              <li>Update DNS records as instructed by Vercel</li>
            </ol>
            <p>
              Your API will then be available at <code>https://geo.yourdomain.com/api/geo</code>
            </p>
          </section>

          <section className="docs-footer-section">
            <h2>Need Help?</h2>
            <p>
              Found a bug or have a feature request? 
              <a href="https://github.com/kamero-ai/geo-location-api/issues" target="_blank" rel="noopener noreferrer">
                Open an issue on GitHub
              </a>
            </p>
          </section>
        </article>
      </main>

      <footer className="docs-footer">
        <p>© 2026 Kamero AI • MIT License</p>
      </footer>
    </div>
  );
}

function CodeBlock({ 
  id, 
  code, 
  language, 
  copied, 
  onCopy 
}: { 
  id: string; 
  code: string; 
  language: string; 
  copied: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="code-wrapper">
      <div className="code-header">
        <span>{language}</span>
        <button onClick={() => onCopy(code, id)}>
          {copied === id ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
