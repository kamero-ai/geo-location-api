import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "Build a Location-Aware App with Next.js and a Free Geolocation API",
  description:
    "Step-by-step guide to building a location-aware web application using Next.js App Router and a free IP geolocation API. Covers server components, interactive maps, and Vercel deployment.",
  keywords: [
    "nextjs geolocation",
    "nextjs ip location",
    "build location app nextjs",
    "nextjs vercel geolocation headers",
    "react map geolocation",
    "nextjs server component location",
    "free geolocation api nextjs",
    "location aware web app tutorial",
    "nextjs leaflet map",
    "vercel edge geolocation",
  ],
  alternates: {
    canonical: "https://geo.kamero.ai/blog/build-location-aware-app-nextjs",
  },
  openGraph: {
    title: "Build a Location-Aware App with Next.js",
    description:
      "Full tutorial on building location-aware apps with Next.js and free IP geolocation.",
    url: "https://geo.kamero.ai/blog/build-location-aware-app-nextjs",
    type: "article",
    publishedTime: "2026-02-06T00:00:00Z",
  },
};

export default function NextJsTutorialPost() {
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
        <h1>Build a Location-Aware App with Next.js and a Free Geolocation API</h1>
        <p className="post-meta">Feb 6, 2026 · 12 min read</p>

        <p>
          Location-aware features can transform a generic web app into something that feels
          personal. In this tutorial, we&apos;ll build a Next.js application that detects
          the visitor&apos;s location, displays it on an interactive map, and uses the data
          to personalize the experience — all using a free geolocation API.
        </p>

        <h2>What We&apos;re Building</h2>
        <p>By the end of this tutorial, you&apos;ll have an app that:</p>
        <ul>
          <li>Detects the visitor&apos;s city, country, and coordinates from their IP</li>
          <li>Shows their location on an interactive Leaflet map</li>
          <li>Displays a personalized welcome message</li>
          <li>Works on both server and client side</li>
          <li>Deploys to Vercel with one click</li>
        </ul>

        <h2>Step 1: Create the Next.js Project</h2>
        <pre><code>{`npx create-next-app@latest geo-app --typescript --app
cd geo-app`}</code></pre>

        <h2>Step 2: Build the Geolocation API Route</h2>
        <p>
          If you&apos;re deploying to Vercel, you can read geolocation directly from
          request headers. Create an API route:
        </p>
        <pre><code>{`// app/api/geo/route.ts
import { geolocation, ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const geo = geolocation(request);
  const ip = ipAddress(request);

  const continent = request.headers.get("x-vercel-ip-continent");
  const timezone = request.headers.get("x-vercel-ip-timezone");
  const postalCode = request.headers.get("x-vercel-ip-postal-code");

  return NextResponse.json(
    {
      ip,
      city: geo.city,
      country: geo.country,
      countryRegion: geo.countryRegion,
      continent,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone,
      postalCode,
      region: geo.region,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}`}</code></pre>
        <p>
          Alternatively, you can call the hosted Kamero API at{" "}
          <code>https://geo.kamero.ai/api/geo</code> from any hosting provider.
        </p>

        <h2>Step 3: Create the Location Display Component</h2>
        <pre><code>{`// app/components/LocationCard.tsx
"use client";

import { useEffect, useState } from "react";

interface GeoData {
  ip: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

export default function LocationCard() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then(setGeo)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Detecting your location...</div>;
  if (!geo) return <div>Could not detect location</div>;

  return (
    <div>
      <h2>Your Location</h2>
      <p><strong>IP:</strong> {geo.ip}</p>
      <p><strong>City:</strong> {geo.city}</p>
      <p><strong>Country:</strong> {geo.country}</p>
      <p><strong>Timezone:</strong> {geo.timezone}</p>
      <p><strong>Coordinates:</strong> {geo.latitude}, {geo.longitude}</p>
    </div>
  );
}`}</code></pre>

        <h2>Step 4: Add an Interactive Map</h2>
        <p>Install Leaflet for the map:</p>
        <pre><code>{`npm install leaflet react-leaflet
npm install -D @types/leaflet`}</code></pre>
        <p>Create a map component (must be client-side only):</p>
        <pre><code>{`// app/components/Map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ lat, lng, city }: {
  lat: number;
  lng: number;
  city: string;
}) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={11}
      style={{ height: "400px", width: "100%", borderRadius: "1rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{city}</Popup>
      </Marker>
    </MapContainer>
  );
}`}</code></pre>
        <p>
          Since Leaflet requires the <code>window</code> object, use Next.js dynamic imports
          to disable SSR:
        </p>
        <pre><code>{`import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
});`}</code></pre>

        <h2>Step 5: Server-Side Personalization</h2>
        <p>
          For SEO-friendly personalization, you can read location headers in a Server
          Component (Vercel only):
        </p>
        <pre><code>{`// app/page.tsx (Server Component)
import { headers } from "next/headers";

export default async function Home() {
  const headerList = await headers();
  const city = headerList.get("x-vercel-ip-city") || "there";
  const country = headerList.get("x-vercel-ip-country") || "";

  return (
    <main>
      <h1>Hello from {decodeURIComponent(city)}!</h1>
      {country && <p>We see you\\'re visiting from {country}</p>}
      {/* Client components for interactive features */}
    </main>
  );
}`}</code></pre>

        <h2>Step 6: Deploy to Vercel</h2>
        <p>
          Push your code to GitHub and import it in Vercel, or use the CLI:
        </p>
        <pre><code>{`npm i -g vercel
vercel deploy --prod`}</code></pre>
        <p>
          Once deployed, the geolocation headers are automatically populated by Vercel&apos;s
          Edge Network. Your app will detect visitor locations globally with sub-50ms latency.
        </p>

        <h2>Alternative: Use the Hosted API</h2>
        <p>
          If you&apos;re not deploying to Vercel, you can use the hosted Kamero Geo API
          from any platform:
        </p>
        <pre><code>{`// Works from any hosting provider
const geo = await fetch("https://geo.kamero.ai/api/geo")
  .then(r => r.json());`}</code></pre>
        <p>
          Or deploy your own instance of the Kamero Geo API to Vercel and point your app
          at your custom domain.
        </p>

        <h2>What&apos;s Next?</h2>
        <p>From here, you could extend the app with:</p>
        <ul>
          <li>Currency conversion based on the visitor&apos;s country</li>
          <li>Language detection and i18n routing</li>
          <li>Nearby location search using the coordinates</li>
          <li>Weather data based on the detected city</li>
          <li>Server-side analytics logging visitor geography</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Deploy Your Own Geo API</h3>
          <p>One-click deploy to Vercel. Open source, MIT licensed.</p>
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api"
            className="cta-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy to Vercel →
          </a>
        </div>
      </article>

      <footer className="blog-footer">
        <p>© 2026 Kamero AI · MIT License</p>
      </footer>
    </div>
  );
}
