"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./components/ThemeProvider";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

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

const continentNames: Record<string, string> = {
  AF: "Africa",
  AN: "Antarctica",
  AS: "Asia",
  EU: "Europe",
  NA: "North America",
  OC: "Oceania",
  SA: "South America",
};

const faqs = [
  {
    question: "What is the Kamero Geo IP API?",
    answer: "Kamero Geo IP API is a free, open-source REST API that returns geolocation data based on the visitor's IP address. It provides information including IP address, city, country, region, continent, coordinates (latitude/longitude), timezone, and postal code."
  },
  {
    question: "Do I need an API key to use this service?",
    answer: "No, you don't need an API key. The API is completely free to use and requires no registration or authentication. Simply make a GET request to the endpoint and receive your geolocation data."
  },
  {
    question: "What data does the API return?",
    answer: "The API returns: IP address, city name, country code (ISO 3166-1), region/state code (ISO 3166-2), continent code, latitude, longitude, timezone (IANA format), postal/ZIP code, and the Vercel edge region that served your request."
  },
  {
    question: "How accurate is the geolocation data?",
    answer: "The geolocation data is provided by Vercel's Edge Network, which uses industry-standard IP geolocation databases. Accuracy varies by region but is generally accurate to the city level for most locations. Note that VPN users or those on private networks may see less accurate results."
  },
  {
    question: "What is the response time of the API?",
    answer: "The API is powered by Vercel's global Edge Network, delivering sub-50ms response times for most locations worldwide. Requests are served from the nearest edge location to minimize latency."
  },
  {
    question: "Can I use this API in production?",
    answer: "Yes! The API is designed for production use. It's open-source under the MIT license, has CORS enabled for all origins, and you can also self-host your own instance by deploying to Vercel for complete control."
  },
  {
    question: "Is there a rate limit?",
    answer: "The hosted API at geo.kamero.ai has no enforced rate limits. However, for high-volume applications, we recommend deploying your own instance to ensure reliability and avoid any potential future limitations."
  },
  {
    question: "Can I self-host this API?",
    answer: "Yes! The entire project is open-source on GitHub. You can deploy your own instance to Vercel with one click, giving you full control over your geolocation service. Note that geolocation headers only work when deployed to Vercel."
  },
  {
    question: "What frameworks and languages are supported?",
    answer: "The API returns standard JSON responses, making it compatible with any programming language or framework. We provide code examples for JavaScript, Python, cURL, PHP, Go, and more in our documentation."
  },
  {
    question: "Why might some fields return undefined?",
    answer: "Fields may return undefined when geolocation cannot be determined. This typically happens with VPN users, private networks, certain mobile carriers, or during local development (geolocation headers only work on Vercel deployments)."
  }
];

export default function Home() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          alt="Kamero Geo IP API Logo"
          width={160}
          height={40}
          priority
        />
        <nav className="nav">
          <Link href="/docs" className="nav-link">
            Docs
          </Link>
          <Link href="/blog" className="nav-link">
            Blog
          </Link>
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
          <ThemeToggle />
        </nav>
      </header>

      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="title">Free IP Geolocation API</h1>
          <p className="subtitle">
            Get user location by IP address instantly. Returns IP, city, country,
            continent, timezone, coordinates, and postal code.
            <br />
            <strong>No API key required.</strong> Open source & powered by Vercel Edge Network.
          </p>
          <div className="hero-buttons">
            <Link href="/docs" className="btn btn-primary">
              View Documentation
            </Link>
            <a
              href="https://github.com/kamero-ai/geo-location-api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              GitHub Repository
            </a>
          </div>
        </section>

        {/* Live Demo Section */}
        <section className="demo-section">
          <h2 className="section-title">Your Location (Live Demo)</h2>
          <p className="section-desc">
            This data is fetched in real-time from our API based on your IP address
          </p>
          
          <div className="map-section">
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
              <h3 className="card-title">API Response</h3>
              {loading ? (
                <div className="loading-text">Detecting...</div>
              ) : geo ? (
                <div className="location-grid">
                  <LocationItem label="IP Address" value={geo.ip} />
                  <LocationItem label="City" value={geo.city} />
                  <LocationItem label="Country" value={geo.country} />
                  <LocationItem label="Region" value={geo.countryRegion} />
                  <LocationItem 
                    label="Continent" 
                    value={geo.continent ? `${geo.continent} (${continentNames[geo.continent] || geo.continent})` : undefined} 
                  />
                  <LocationItem label="Latitude" value={geo.latitude} />
                  <LocationItem label="Longitude" value={geo.longitude} />
                  <LocationItem label="Timezone" value={geo.timezone} />
                  <LocationItem label="Postal Code" value={geo.postalCode} />
                  <LocationItem label="Edge Server" value={geo.region} />
                </div>
              ) : (
                <div className="loading-text">Location unavailable</div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="api-section">
          <h2 className="section-title">Quick Start</h2>
          <p className="section-desc">
            Make a single GET request to get geolocation data as JSON
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
  "ip": "${geo?.ip || "203.0.113.42"}",
  "city": "${geo?.city || "San Francisco"}",
  "country": "${geo?.country || "US"}",
  "countryRegion": "${geo?.countryRegion || "CA"}",
  "continent": "${geo?.continent || "NA"}",
  "latitude": "${geo?.latitude || "37.7749"}",
  "longitude": "${geo?.longitude || "-122.4194"}",
  "timezone": "${geo?.timezone || "America/Los_Angeles"}",
  "postalCode": "${geo?.postalCode || "94102"}",
  "region": "${geo?.region || "sfo1"}"
}`}
            </pre>
          </div>
        </section>

        {/* Data Points Section */}
        <section className="data-section">
          <h2 className="section-title">10 Data Points Per Request</h2>
          <p className="section-desc">
            Comprehensive geolocation data returned with every API call
          </p>
          <div className="data-grid">
            <DataCard 
              title="IP Address" 
              description="Public IPv4 or IPv6 address of the visitor"
              field="ip"
            />
            <DataCard 
              title="City" 
              description="City name associated with the IP address"
              field="city"
            />
            <DataCard 
              title="Country" 
              description="ISO 3166-1 alpha-2 country code (e.g., US, GB, IN)"
              field="country"
            />
            <DataCard 
              title="Region/State" 
              description="ISO 3166-2 region or state code"
              field="countryRegion"
            />
            <DataCard 
              title="Continent" 
              description="Continent code: AF, AN, AS, EU, NA, OC, SA"
              field="continent"
            />
            <DataCard 
              title="Latitude" 
              description="Geographic latitude coordinate"
              field="latitude"
            />
            <DataCard 
              title="Longitude" 
              description="Geographic longitude coordinate"
              field="longitude"
            />
            <DataCard 
              title="Timezone" 
              description="IANA timezone (e.g., America/New_York)"
              field="timezone"
            />
            <DataCard 
              title="Postal Code" 
              description="ZIP or postal code near the location"
              field="postalCode"
            />
            <DataCard 
              title="Edge Region" 
              description="Vercel edge server that handled the request"
              field="region"
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose Kamero Geo API?</h2>
          <div className="features-grid">
            <FeatureCard
              icon="⚡"
              title="Fast Response Times"
              description="Powered by Vercel's global Edge Network for sub-50ms responses worldwide"
            />
            <FeatureCard
              icon="🔓"
              title="No API Key Required"
              description="Start using immediately without registration, authentication, or sign-up"
            />
            <FeatureCard
              icon="🌍"
              title="Global Coverage"
              description="Accurate geolocation data for visitors from anywhere in the world"
            />
            <FeatureCard
              icon="📖"
              title="Open Source"
              description="MIT licensed. Fork it, modify it, deploy your own instance on Vercel"
            />
            <FeatureCard
              icon="🔗"
              title="CORS Enabled"
              description="Works from any domain. Use directly in browser-side JavaScript"
            />
            <FeatureCard
              icon="💰"
              title="100% Free"
              description="No hidden costs, no premium tiers. Free for personal and commercial use"
            />
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="usecases-section">
          <h2 className="section-title">Common Use Cases</h2>
          <p className="section-desc">
            How developers use IP geolocation in their applications
          </p>
          <div className="usecases-grid">
            <UseCaseCard
              icon="🎯"
              title="Content Personalization"
              description="Show localized content, language, or promotions based on visitor location"
            />
            <UseCaseCard
              icon="📊"
              title="Analytics & Insights"
              description="Track visitor geography without relying on third-party analytics services"
            />
            <UseCaseCard
              icon="🛡️"
              title="Access Control"
              description="Restrict or allow access based on geographic location or region"
            />
            <UseCaseCard
              icon="🕐"
              title="Timezone Detection"
              description="Display times in the user's local timezone automatically"
            />
            <UseCaseCard
              icon="📍"
              title="Default Location"
              description="Pre-fill forms or set map defaults based on approximate user location"
            />
            <UseCaseCard
              icon="🔍"
              title="Debugging & Logging"
              description="Log visitor locations for debugging, monitoring, or audit purposes"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaq === index ? 'open' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-desc">
            Start using the API now or deploy your own instance for free
          </p>
          <div className="cta-buttons">
            <a
              href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Deploy Your Own
            </a>
            <Link href="/docs" className="btn btn-secondary">
              Read the Docs
            </Link>
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
          <p className="footer-text">© 2026 Kamero AI • MIT License</p>
          <div className="footer-links">
            <Link href="/blog">Blog</Link>
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

function DataCard({
  title,
  description,
  field,
}: {
  title: string;
  description: string;
  field: string;
}) {
  return (
    <div className="data-card">
      <code className="data-field">{field}</code>
      <h3 className="data-title">{title}</h3>
      <p className="data-desc">{description}</p>
    </div>
  );
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="usecase-card">
      <span className="usecase-icon">{icon}</span>
      <h3 className="usecase-title">{title}</h3>
      <p className="usecase-desc">{description}</p>
    </div>
  );
}
