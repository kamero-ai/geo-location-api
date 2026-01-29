"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

interface GeoData {
  city: string;
  country: string;
  countryRegion: string;
  latitude: string;
  longitude: string;
  region: string;
}

export default function Home() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        setGeo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiExample = `fetch("https://geo.kamero.ai/api/geo")
  .then(res => res.json())
  .then(data => console.log(data));`;

  return (
    <div className="container">
      <header className="header">
        <Image
          src="/kamero_logo.svg"
          alt="Kamero Logo"
          width={160}
          height={40}
          priority
        />
        <nav className="nav">
          <a
            href="https://github.com/kamero-ai/geo-location-api"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub
          </a>
          <a href="/api/geo" className="nav-link">
            API
          </a>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1 className="title">
            Free Geo IP Location API
          </h1>
          <p className="subtitle">
            Get user location by IP address instantly. No API key required.
            <br />
            Open source & powered by Vercel Edge Network.
          </p>
        </section>

        <section className="map-section">
          <div className="map-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <span>Detecting your location...</span>
              </div>
            ) : geo?.latitude && geo?.longitude ? (
              <Map
                lat={parseFloat(geo.latitude)}
                lng={parseFloat(geo.longitude)}
                city={geo.city || "Unknown"}
                country={geo.country || "Unknown"}
              />
            ) : (
              <div className="loading">Could not determine location</div>
            )}
          </div>

          <div className="location-card">
            <h2 className="card-title">Your Location</h2>
            {loading ? (
              <div className="loading-text">Detecting...</div>
            ) : geo ? (
              <div className="location-grid">
                <LocationItem label="City" value={geo.city} />
                <LocationItem label="Country" value={geo.country} />
                <LocationItem label="Region" value={geo.countryRegion} />
                <LocationItem label="Latitude" value={geo.latitude} />
                <LocationItem label="Longitude" value={geo.longitude} />
                <LocationItem label="Edge Server" value={geo.region} />
              </div>
            ) : (
              <div className="loading-text">Location unavailable</div>
            )}
          </div>
        </section>

        <section className="api-section">
          <h2 className="section-title">Quick Start</h2>
          <p className="section-desc">
            Make a GET request to get geolocation data as JSON
          </p>

          <div className="endpoint-box">
            <code className="endpoint">GET https://geo.kamero.ai/api/geo</code>
            <button
              className="copy-btn"
              onClick={() => copyToClipboard("https://geo.kamero.ai/api/geo")}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="code-block">
            <div className="code-header">
              <span>JavaScript</span>
            </div>
            <pre className="code-content">{apiExample}</pre>
          </div>

          <div className="response-block">
            <div className="code-header">
              <span>Response</span>
            </div>
            <pre className="code-content">
{`{
  "city": "${geo?.city || "San Francisco"}",
  "country": "${geo?.country || "US"}",
  "countryRegion": "${geo?.countryRegion || "CA"}",
  "latitude": "${geo?.latitude || "37.7749"}",
  "longitude": "${geo?.longitude || "-122.4194"}",
  "region": "${geo?.region || "sfo1"}"
}`}
            </pre>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Why Use This API?</h2>
          <div className="features-grid">
            <FeatureCard
              icon="⚡"
              title="Lightning Fast"
              description="Powered by Vercel Edge Network for sub-50ms response times globally"
            />
            <FeatureCard
              icon="🔓"
              title="No API Key"
              description="Start using immediately without registration or authentication"
            />
            <FeatureCard
              icon="🌍"
              title="Global Coverage"
              description="Accurate geolocation data for visitors from anywhere in the world"
            />
            <FeatureCard
              icon="📖"
              title="Open Source"
              description="MIT licensed. Fork it, modify it, deploy your own instance"
            />
          </div>
        </section>

        <section className="cta-section">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-desc">
            Deploy your own instance or use our hosted API for free
          </p>
          <div className="cta-buttons">
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Deploy on Vercel
            </a>
            <a
              href="https://github.com/kamero-ai/geo-location-api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View on GitHub
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <Image
            src="/kamero_logo.svg"
            alt="Kamero Logo"
            width={120}
            height={30}
          />
          <p className="footer-text">
            © 2026 Kamero AI • MIT License
          </p>
          <div className="footer-links">
            <a href="https://kamero.ai" target="_blank" rel="noopener noreferrer">
              Kamero AI
            </a>
            <a
              href="https://github.com/kamero-ai/geo-location-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LocationItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="location-item">
      <span className="location-label">{label}</span>
      <span className="location-value">{value || "—"}</span>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature-card">
      <span className="feature-icon">{icon}</span>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}
