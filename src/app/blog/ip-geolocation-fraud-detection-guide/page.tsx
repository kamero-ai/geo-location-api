import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "Using IP Geolocation for Fraud Detection: A Developer's Guide",
  description:
    "Learn how to use IP geolocation data to detect and prevent fraud in web applications. Covers location mismatch detection, velocity checks, impossible travel, and risk scoring.",
  keywords: [
    "ip geolocation fraud detection",
    "fraud prevention ip address",
    "ip location mismatch fraud",
    "geolocation risk scoring",
    "detect fraud ip address",
    "impossible travel detection",
    "ip fraud prevention api",
    "ecommerce fraud geolocation",
    "payment fraud ip detection",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-fraud-detection-guide" },
  openGraph: {
    title: "IP Geolocation for Fraud Detection",
    description: "How to use IP location data to detect and prevent fraud in web apps.",
    url: "https://geo.kamero.ai/blog/ip-geolocation-fraud-detection-guide",
    type: "article",
    publishedTime: "2026-01-28T00:00:00Z",
  },
};

export default function FraudDetectionPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>Using IP Geolocation for Fraud Detection: A Developer&apos;s Guide</h1>
        <p className="post-meta">Jan 28, 2026 · 8 min read</p>

        <p>
          IP geolocation is one of the most accessible fraud signals available to developers.
          It won&apos;t catch everything on its own, but combined with other data points, it
          forms a critical layer in any fraud prevention stack.
        </p>

        <h2>Why IP Location Matters for Fraud</h2>
        <p>
          Fraudsters often operate from different locations than their victims. A stolen
          credit card from Texas being used from an IP in Eastern Europe is a strong signal.
          IP geolocation helps you detect these mismatches automatically.
        </p>

        <h2>Pattern 1: Billing Address Mismatch</h2>
        <p>
          The most basic check — compare the IP location with the billing or shipping address:
        </p>
        <pre><code>{`async function checkLocationMismatch(order) {
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  const riskFactors = [];

  // Country mismatch
  if (order.billingCountry !== geo.country) {
    riskFactors.push({
      type: "country_mismatch",
      severity: "high",
      detail: \`Billing: \${order.billingCountry}, IP: \${geo.country}\`,
    });
  }

  // Region mismatch (same country, different state)
  if (order.billingCountry === geo.country &&
      order.billingState !== geo.countryRegion) {
    riskFactors.push({
      type: "region_mismatch",
      severity: "medium",
      detail: \`Billing: \${order.billingState}, IP: \${geo.countryRegion}\`,
    });
  }

  return riskFactors;
}`}</code></pre>

        <h2>Pattern 2: Impossible Travel</h2>
        <p>
          If a user logs in from New York and then from Tokyo 30 minutes later, something
          is wrong. Track login locations and flag physically impossible travel:
        </p>
        <pre><code>{`function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function checkImpossibleTravel(userId, currentGeo) {
  const lastLogin = await db.getLastLogin(userId);
  if (!lastLogin) return null;

  const distance = haversineDistance(
    lastLogin.latitude, lastLogin.longitude,
    parseFloat(currentGeo.latitude),
    parseFloat(currentGeo.longitude)
  );

  const timeDiffHours =
    (Date.now() - lastLogin.timestamp) / (1000 * 60 * 60);

  // Max realistic travel speed: ~900 km/h (commercial flight)
  const maxPossibleDistance = timeDiffHours * 900;

  if (distance > maxPossibleDistance) {
    return {
      type: "impossible_travel",
      severity: "critical",
      detail: \`\${Math.round(distance)}km in \${timeDiffHours.toFixed(1)}h\`,
    };
  }

  return null;
}`}</code></pre>

        <h2>Pattern 3: High-Risk Region Detection</h2>
        <p>
          Some regions have statistically higher fraud rates. You can adjust risk scores
          based on the IP&apos;s continent or country:
        </p>
        <pre><code>{`function getRegionRiskScore(geo) {
  // These are examples — adjust based on your actual fraud data
  const highRiskCountries = new Set(["XX", "YY", "ZZ"]);
  const mediumRiskCountries = new Set(["AA", "BB"]);

  let score = 0;

  if (highRiskCountries.has(geo.country)) score += 30;
  else if (mediumRiskCountries.has(geo.country)) score += 15;

  // Mismatched timezone can indicate proxy usage
  const browserTz = order.browserTimezone; // from client
  if (browserTz && browserTz !== geo.timezone) {
    score += 20; // Timezone mismatch suggests VPN/proxy
  }

  return score;
}`}</code></pre>

        <h2>Pattern 4: Velocity Checks</h2>
        <p>
          Multiple orders from the same IP in a short window is suspicious:
        </p>
        <pre><code>{`async function checkVelocity(ip) {
  const recentOrders = await db.orders.count({
    ip,
    createdAt: { $gt: new Date(Date.now() - 3600000) }, // last hour
  });

  if (recentOrders > 5) {
    return {
      type: "high_velocity",
      severity: "high",
      detail: \`\${recentOrders} orders from same IP in 1 hour\`,
    };
  }

  return null;
}`}</code></pre>

        <h2>Building a Risk Score</h2>
        <p>
          Combine all signals into a single risk score:
        </p>
        <pre><code>{`async function calculateFraudRisk(order) {
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  let riskScore = 0;
  const flags = [];

  // Location mismatch
  const mismatches = await checkLocationMismatch(order);
  mismatches.forEach(m => {
    riskScore += m.severity === "high" ? 25 : 10;
    flags.push(m);
  });

  // Impossible travel
  const travel = await checkImpossibleTravel(order.userId, geo);
  if (travel) {
    riskScore += 40;
    flags.push(travel);
  }

  // Region risk
  riskScore += getRegionRiskScore(geo);

  // Velocity
  const velocity = await checkVelocity(geo.ip);
  if (velocity) {
    riskScore += 20;
    flags.push(velocity);
  }

  // Decision
  const decision = riskScore >= 60 ? "block"
    : riskScore >= 30 ? "review"
    : "allow";

  return { riskScore, decision, flags, geo };
}`}</code></pre>

        <h2>Limitations to Keep in Mind</h2>
        <ul>
          <li><strong>VPN users trigger false positives.</strong> Many legitimate users use VPNs. Don&apos;t auto-block based on location alone.</li>
          <li><strong>Mobile IPs are less accurate.</strong> Carrier IPs may resolve to a different city than the user&apos;s actual location.</li>
          <li><strong>IP geolocation is one signal, not a verdict.</strong> Always combine with other factors: device fingerprint, purchase history, email age, etc.</li>
          <li><strong>Legitimate travel exists.</strong> Business travelers and digital nomads will trigger impossible travel alerts. Use it as a signal, not a block.</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Add Location Data to Your Fraud Stack</h3>
          <p>Free API with IP, city, country, coordinates, and timezone.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
