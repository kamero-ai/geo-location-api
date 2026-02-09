import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "VPN and Proxy Detection: How They Affect IP Geolocation",
  description:
    "Understand how VPNs, proxies, and Tor affect IP geolocation accuracy. Learn detection techniques, why users mask their IP, and how to handle masked traffic in your app.",
  keywords: ["vpn detection ip", "proxy detection geolocation", "vpn ip geolocation", "detect vpn user", "tor ip detection", "ip masking geolocation", "vpn affects ip location", "proxy ip address detection", "how vpn changes ip location"],
  alternates: { canonical: "https://geo.kamero.ai/blog/vpn-proxy-detection-ip-geolocation" },
  openGraph: { title: "VPN and Proxy Detection: Impact on IP Geolocation", description: "How VPNs, proxies, and Tor affect IP-based location detection.", url: "https://geo.kamero.ai/blog/vpn-proxy-detection-ip-geolocation", type: "article", publishedTime: "2026-01-10T00:00:00Z" },
};

export default function VPNDetectionPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Deep Dive</span>
        <h1>VPN and Proxy Detection: How They Affect IP Geolocation</h1>
        <p className="post-meta">Jan 10, 2026 · 7 min read</p>

        <p>VPN usage has grown significantly — estimates suggest 30-40% of internet users use a VPN at least occasionally. For developers relying on IP geolocation, this means a meaningful chunk of your traffic will show incorrect locations. Here&apos;s what you need to know.</p>

        <h2>How VPNs Change Your IP Location</h2>
        <p>When a user connects through a VPN, their traffic is routed through a server in another location. The website sees the VPN server&apos;s IP address, not the user&apos;s real one. A user in Tokyo connected to a US VPN server will appear to be in the United States.</p>

        <h2>Types of IP Masking</h2>
        <table>
          <thead><tr><th>Method</th><th>How It Works</th><th>Detection Difficulty</th></tr></thead>
          <tbody>
            <tr><td>Commercial VPN</td><td>Routes through VPN provider servers</td><td>Moderate — known IP ranges</td></tr>
            <tr><td>Corporate VPN</td><td>Routes through company gateway</td><td>Hard — looks like normal traffic</td></tr>
            <tr><td>HTTP Proxy</td><td>Intermediary forwards requests</td><td>Easy — often leaks headers</td></tr>
            <tr><td>SOCKS Proxy</td><td>Lower-level proxy protocol</td><td>Moderate</td></tr>
            <tr><td>Tor</td><td>Multi-hop relay network</td><td>Easy — known exit nodes</td></tr>
            <tr><td>Residential Proxy</td><td>Routes through real home IPs</td><td>Very hard</td></tr>
          </tbody>
        </table>

        <h2>Detection Techniques</h2>

        <h3>1. Timezone Mismatch</h3>
        <p>Compare the IP-based timezone with the browser&apos;s timezone:</p>
        <pre><code>{`async function detectTimezoneAnomaly() {
  const { timezone: ipTimezone } = await fetch(
    "https://geo.kamero.ai/api/geo"
  ).then(r => r.json());

  const browserTimezone = Intl.DateTimeFormat()
    .resolvedOptions().timeZone;

  if (ipTimezone && browserTimezone !== ipTimezone) {
    return {
      anomaly: true,
      ipTimezone,
      browserTimezone,
      // Could be VPN, or user manually changed TZ
    };
  }

  return { anomaly: false };
}`}</code></pre>

        <h3>2. Language Mismatch</h3>
        <pre><code>{`async function detectLanguageAnomaly() {
  const { country } = await fetch(
    "https://geo.kamero.ai/api/geo"
  ).then(r => r.json());

  const browserLang = navigator.language.split("-")[0];

  // Expected primary languages by country
  const expected = {
    JP: "ja", DE: "de", FR: "fr", BR: "pt",
    CN: "zh", KR: "ko", RU: "ru", IT: "it",
  };

  const expectedLang = expected[country];
  if (expectedLang && browserLang !== expectedLang && browserLang !== "en") {
    return { anomaly: true, country, browserLang, expectedLang };
  }

  return { anomaly: false };
}`}</code></pre>

        <h3>3. WebRTC Leak Detection</h3>
        <p>Some VPNs leak the real IP through WebRTC. While this is a privacy concern for users, it can be a detection signal:</p>
        <pre><code>{`// Note: Modern VPNs and browsers increasingly block this
async function getWebRTCIPs(): Promise<string[]> {
  return new Promise((resolve) => {
    const ips: string[] = [];
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.createDataChannel("");
    pc.createOffer().then(offer => pc.setLocalDescription(offer));

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        pc.close();
        resolve(ips);
        return;
      }
      const match = event.candidate.candidate.match(
        /([0-9]{1,3}(\\.[0-9]{1,3}){3})/
      );
      if (match && !match[1].startsWith("192.168")
          && !match[1].startsWith("10.")) {
        ips.push(match[1]);
      }
    };

    setTimeout(() => { pc.close(); resolve(ips); }, 3000);
  });
}`}</code></pre>

        <h2>How to Handle VPN Users</h2>
        <p>The right approach depends on your use case:</p>

        <h3>For Personalization (Content, Currency, Language)</h3>
        <p>Accept the VPN location gracefully. If someone is using a US VPN, showing them USD pricing is fine — they chose that location.</p>

        <h3>For Analytics</h3>
        <p>Flag potential VPN traffic but still count it. Note the anomaly in your data so you can filter if needed.</p>

        <h3>For Fraud Prevention</h3>
        <p>VPN usage is a risk signal, not proof of fraud. Add it to your risk score but don&apos;t auto-block:</p>
        <pre><code>{`async function assessVPNRisk() {
  const geo = await fetch("https://geo.kamero.ai/api/geo")
    .then(r => r.json());

  let riskScore = 0;
  const signals = [];

  // Timezone check
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (geo.timezone && browserTz !== geo.timezone) {
    riskScore += 15;
    signals.push("timezone_mismatch");
  }

  // Language check
  const lang = navigator.language.split("-")[0];
  const langMap = { JP: "ja", DE: "de", FR: "fr", CN: "zh" };
  if (langMap[geo.country] && lang !== langMap[geo.country]) {
    riskScore += 10;
    signals.push("language_mismatch");
  }

  return { riskScore, signals, geo };
}`}</code></pre>

        <h3>For Compliance / Geo-Blocking</h3>
        <p>If you legally must block certain regions, VPN bypass is a known limitation. Document that you use IP-based blocking and that VPN circumvention is the user&apos;s responsibility. For strict compliance, combine with additional verification (phone number, ID, payment method country).</p>

        <h2>Key Takeaways</h2>
        <ul>
          <li>30-40% of users may be on VPNs — plan for it</li>
          <li>Timezone and language mismatches are the easiest client-side signals</li>
          <li>VPN usage is not inherently malicious — many users have legitimate privacy reasons</li>
          <li>Use VPN detection as one signal among many, never as a sole decision factor</li>
          <li>For personalization, just respect the apparent location</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Get IP Location Data</h3>
          <p>Returns timezone for mismatch detection. Free, no key required.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
