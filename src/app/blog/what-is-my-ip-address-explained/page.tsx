import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "What Is My IP Address? How IP Addresses Work (Simple Explanation)",
  description:
    "Learn what an IP address is, how it works, the difference between IPv4 and IPv6, public vs private IPs, and how websites use your IP to detect your location.",
  keywords: [
    "what is my ip address",
    "how ip address works",
    "ipv4 vs ipv6",
    "public vs private ip",
    "ip address explained",
    "how websites know my location",
    "what is ip geolocation",
    "find my ip address",
    "ip address for beginners",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/what-is-my-ip-address-explained" },
  openGraph: {
    title: "What Is My IP Address? How IP Addresses Work",
    description: "Simple explanation of IP addresses, how they work, and how they reveal your location.",
    url: "https://geo.kamero.ai/blog/what-is-my-ip-address-explained",
    type: "article",
    publishedTime: "2026-02-02T00:00:00Z",
  },
};

export default function WhatIsMyIPPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Explainer</span>
        <h1>What Is My IP Address? How IP Addresses Work</h1>
        <p className="post-meta">Feb 2, 2026 · 6 min read</p>

        <p>
          Every device connected to the internet has an IP address. It&apos;s how data
          finds its way from a server to your browser and back. But what exactly is it,
          and how do websites use it to know where you are?
        </p>

        <h2>What Is an IP Address?</h2>
        <p>
          An IP (Internet Protocol) address is a unique numerical label assigned to every
          device on a network. Think of it like a mailing address for your computer — it
          tells other devices where to send data so it reaches you.
        </p>
        <p>
          When you visit a website, your browser sends a request that includes your IP
          address. The server uses this address to send the webpage back to you. Without
          it, the internet simply wouldn&apos;t work.
        </p>

        <h2>IPv4 vs IPv6</h2>
        <p>There are two versions of IP addresses in use today:</p>
        <table>
          <thead>
            <tr><th>Feature</th><th>IPv4</th><th>IPv6</th></tr>
          </thead>
          <tbody>
            <tr><td>Format</td><td>192.168.1.1</td><td>2001:0db8:85a3::8a2e:0370:7334</td></tr>
            <tr><td>Address Space</td><td>~4.3 billion</td><td>~340 undecillion</td></tr>
            <tr><td>Adoption</td><td>Still dominant</td><td>Growing (~40% of traffic)</td></tr>
            <tr><td>Example</td><td>203.0.113.42</td><td>2607:f8b0:4004:800::200e</td></tr>
          </tbody>
        </table>
        <p>
          IPv4 addresses are running out, which is why IPv6 was created with a vastly
          larger address space. Most modern networks support both.
        </p>

        <h2>Public vs Private IP Addresses</h2>
        <p>
          Your home network has two types of IP addresses:
        </p>
        <ul>
          <li>
            <strong>Public IP</strong> — Assigned by your ISP, visible to the internet.
            This is what websites see when you visit them. It&apos;s shared by all devices
            on your home network.
          </li>
          <li>
            <strong>Private IP</strong> — Assigned by your router (e.g., 192.168.1.x).
            Only visible within your local network. Not accessible from the internet.
          </li>
        </ul>
        <p>
          When a geolocation API returns your IP, it&apos;s always your public IP — the
          one your ISP assigned to your connection.
        </p>

        <h2>How Do Websites Know My Location from My IP?</h2>
        <p>
          Your IP address doesn&apos;t directly contain your location. Instead, geolocation
          databases maintain mappings between IP ranges and physical locations. Here&apos;s
          how it works:
        </p>
        <ol>
          <li>Your ISP is assigned blocks of IP addresses by a Regional Internet Registry (RIR)</li>
          <li>These assignments include the ISP&apos;s registered address and service area</li>
          <li>Geolocation providers build databases mapping IP ranges to locations using ISP data, network measurements, and user reports</li>
          <li>When a website queries your IP, the database returns the approximate location</li>
        </ol>
        <p>
          The result is typically accurate to the city level — enough to show you local
          weather, set your timezone, or display prices in your currency.
        </p>

        <h2>Find Your IP Address Right Now</h2>
        <p>
          You can see your public IP and location data with a single API call:
        </p>
        <pre><code>{`curl https://geo.kamero.ai/api/geo`}</code></pre>
        <p>This returns your IP along with city, country, timezone, and coordinates:</p>
        <pre><code>{`{
  "ip": "203.0.113.42",
  "city": "San Francisco",
  "country": "US",
  "timezone": "America/Los_Angeles",
  "latitude": "37.7749",
  "longitude": "-122.4194"
}`}</code></pre>
        <p>
          Or just visit <Link href="/">geo.kamero.ai</Link> to see a live demo with your
          location plotted on a map.
        </p>

        <h2>Can Someone Find My Exact Address from My IP?</h2>
        <p>
          No. IP geolocation typically resolves to a city or neighborhood level — not a
          street address. The coordinates point to a general area (often the city center
          or ISP hub), not your physical location.
        </p>
        <p>
          Only your ISP knows the exact address associated with an IP, and they&apos;re
          legally required to protect that information. Law enforcement can request it
          with a court order, but websites and APIs cannot access it.
        </p>

        <h2>How to Hide Your IP Address</h2>
        <p>If you want to mask your IP location:</p>
        <ul>
          <li><strong>VPN</strong> — Routes your traffic through a server in another location. Websites see the VPN server&apos;s IP instead of yours.</li>
          <li><strong>Tor Browser</strong> — Routes traffic through multiple relays. Very private but slower.</li>
          <li><strong>Proxy Server</strong> — Acts as an intermediary. Less secure than a VPN but simpler.</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Check Your IP Location</h3>
          <p>See what our API detects for your IP — live on the homepage.</p>
          <Link href="/" className="cta-btn">View Live Demo →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
