import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation and GDPR: What Developers Need to Know About Privacy",
  description:
    "Is IP geolocation GDPR compliant? Understand how privacy laws affect IP-based location detection, what counts as personal data, and how to use geolocation APIs responsibly.",
  keywords: [
    "ip geolocation gdpr",
    "is ip address personal data gdpr",
    "geolocation api privacy",
    "ip tracking gdpr compliance",
    "gdpr ip address",
    "geolocation privacy law",
    "ip geolocation ccpa",
    "privacy compliant geolocation",
    "gdpr location data",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-gdpr-privacy-compliance" },
  openGraph: {
    title: "IP Geolocation and GDPR: Privacy Guide for Developers",
    description: "What developers need to know about using IP geolocation under GDPR and privacy laws.",
    url: "https://geo.kamero.ai/blog/ip-geolocation-gdpr-privacy-compliance",
    type: "article",
    publishedTime: "2026-01-30T00:00:00Z",
  },
};

export default function GDPRPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>IP Geolocation and GDPR: What Developers Need to Know About Privacy</h1>
        <p className="post-meta">Jan 30, 2026 · 7 min read</p>

        <p>
          If you&apos;re using IP geolocation in an app that serves European users, you
          need to understand how GDPR applies. The short answer: IP addresses are personal
          data under GDPR, but using geolocation APIs can still be compliant if you do it
          right.
        </p>
        <p>
          <em>Note: This is a technical guide, not legal advice. Consult a privacy lawyer
          for your specific situation.</em>
        </p>

        <h2>Is an IP Address Personal Data?</h2>
        <p>
          Yes. Under GDPR, an IP address is considered personal data because it can be
          used (directly or indirectly) to identify a natural person. The European Court
          of Justice confirmed this in the Breyer v. Germany ruling (2016).
        </p>
        <p>
          This means any processing of IP addresses — including sending them to a
          geolocation API — falls under GDPR requirements.
        </p>

        <h2>When Is IP Geolocation GDPR-Compliant?</h2>
        <p>You need a lawful basis for processing. The most relevant ones for geolocation:</p>

        <h3>1. Legitimate Interest (Article 6(1)(f))</h3>
        <p>
          This is the most common basis for IP geolocation. You can argue legitimate
          interest when:
        </p>
        <ul>
          <li>Displaying content in the user&apos;s language</li>
          <li>Showing prices in local currency</li>
          <li>Setting the correct timezone</li>
          <li>Basic analytics (country-level visitor stats)</li>
          <li>Fraud prevention</li>
        </ul>
        <p>
          The key requirement: your interest must not override the user&apos;s privacy
          rights. For basic personalization, this is generally accepted.
        </p>

        <h3>2. Consent (Article 6(1)(a))</h3>
        <p>
          If you&apos;re doing more invasive tracking — like building detailed location
          profiles or combining IP data with other identifiers — you likely need explicit
          consent via a cookie banner or consent dialog.
        </p>

        <h3>3. Contract Performance (Article 6(1)(b))</h3>
        <p>
          If location detection is necessary to deliver the service (e.g., a delivery app
          needs to know the user&apos;s region), this basis applies.
        </p>

        <h2>Self-Hosting: The Privacy Advantage</h2>
        <p>
          One of the biggest GDPR concerns with geolocation APIs is data transfer — sending
          your users&apos; IP addresses to a third-party service. This creates a data
          processor relationship and potentially involves cross-border data transfers.
        </p>
        <p>
          Self-hosting your geolocation API eliminates this concern entirely. With Kamero
          Geo API, you can deploy your own instance:
        </p>
        <pre><code>{`# Deploy your own — no IP data leaves your infrastructure
# Vercel reads geolocation from edge headers
# No third-party API calls, no data sharing

# One-click deploy:
# https://vercel.com/new/clone?repository-url=
#   https://github.com/kamero-ai/geo-location-api`}</code></pre>
        <p>
          When self-hosted on Vercel, geolocation is resolved at the edge from request
          headers. The IP address is never sent to an external service — it stays within
          your Vercel deployment.
        </p>

        <h2>Best Practices for GDPR-Compliant Geolocation</h2>
        <ol>
          <li>
            <strong>Minimize data collection.</strong> Only collect the geolocation fields
            you actually need. If you only need the country, don&apos;t store coordinates.
          </li>
          <li>
            <strong>Don&apos;t store IP addresses.</strong> If you only need the derived
            location (city, country), discard the IP after lookup.
          </li>
          <li>
            <strong>Document your legitimate interest.</strong> Write a Legitimate Interest
            Assessment (LIA) explaining why you need geolocation and how you protect user
            privacy.
          </li>
          <li>
            <strong>Update your privacy policy.</strong> Disclose that you use IP-based
            geolocation, what data you collect, and why.
          </li>
          <li>
            <strong>Consider self-hosting.</strong> Eliminates third-party data sharing
            concerns entirely.
          </li>
          <li>
            <strong>Provide opt-out.</strong> Let users disable location-based features
            if they prefer.
          </li>
        </ol>

        <h2>CCPA and Other Privacy Laws</h2>
        <p>
          GDPR isn&apos;t the only privacy law that affects IP geolocation:
        </p>
        <table>
          <thead>
            <tr><th>Law</th><th>Region</th><th>IP as Personal Data?</th><th>Key Requirement</th></tr>
          </thead>
          <tbody>
            <tr><td>GDPR</td><td>EU/EEA</td><td>Yes</td><td>Lawful basis required</td></tr>
            <tr><td>CCPA/CPRA</td><td>California</td><td>Yes</td><td>Disclosure + opt-out right</td></tr>
            <tr><td>LGPD</td><td>Brazil</td><td>Yes</td><td>Similar to GDPR</td></tr>
            <tr><td>PIPEDA</td><td>Canada</td><td>Yes</td><td>Consent for collection</td></tr>
            <tr><td>POPIA</td><td>South Africa</td><td>Yes</td><td>Lawful purpose required</td></tr>
          </tbody>
        </table>

        <h2>Practical Pattern: Privacy-First Geolocation</h2>
        <pre><code>{`// Privacy-first approach:
// 1. Detect location
// 2. Use it for personalization
// 3. Don't store the IP

async function getVisitorContext() {
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  // Return only what you need — discard the IP
  return {
    country: geo.country,
    timezone: geo.timezone,
    continent: geo.continent,
    // ip: geo.ip  ← Don't store this unless you need it
  };
}

// Use for personalization without tracking
const ctx = await getVisitorContext();
setLocale(ctx.country);
setTimezone(ctx.timezone);`}</code></pre>

        <div className="blog-post-cta">
          <h3>Self-Host for Maximum Privacy</h3>
          <p>Deploy your own geolocation API. No IP data leaves your infrastructure.</p>
          <a href="https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api" className="cta-btn" target="_blank" rel="noopener noreferrer">Deploy to Vercel →</a>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
