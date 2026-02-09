import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Detect User Timezone in JavaScript (3 Methods Compared)",
  description:
    "Three ways to detect a user's timezone in JavaScript: Intl API, IP geolocation, and Date offset. Compare accuracy, reliability, and when to use each approach.",
  keywords: [
    "detect user timezone javascript",
    "javascript get timezone",
    "intl datetimeformat timezone",
    "ip geolocation timezone",
    "javascript timezone detection",
    "get visitor timezone",
    "automatic timezone detection",
    "user timezone api",
    "javascript date timezone",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/detect-user-timezone-javascript" },
  openGraph: {
    title: "How to Detect User Timezone in JavaScript",
    description: "Three methods compared: Intl API, IP geolocation, and Date offset.",
    url: "https://geo.kamero.ai/blog/detect-user-timezone-javascript",
    type: "article",
    publishedTime: "2026-02-01T00:00:00Z",
  },
};

export default function TimezonePost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>How to Detect User Timezone in JavaScript (3 Methods Compared)</h1>
        <p className="post-meta">Feb 1, 2026 · 7 min read</p>

        <p>
          Displaying times in the wrong timezone is a surprisingly common UX problem.
          Meeting schedulers, event platforms, dashboards, and notification systems all
          need to know the user&apos;s timezone. Here are three ways to detect it, with
          tradeoffs for each.
        </p>

        <h2>Method 1: Intl API (Client-Side)</h2>
        <p>The simplest and most reliable client-side approach:</p>
        <pre><code>{`const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timezone); // "America/New_York"`}</code></pre>
        <p>Pros:</p>
        <ul>
          <li>No API call needed — instant, zero latency</li>
          <li>Reads from the OS timezone setting — very accurate</li>
          <li>Supported in all modern browsers (97%+ coverage)</li>
        </ul>
        <p>Cons:</p>
        <ul>
          <li>Only works client-side — not available in server components or APIs</li>
          <li>Returns the OS setting, which the user may have configured incorrectly</li>
          <li>Can&apos;t be used for server-side rendering or email scheduling</li>
        </ul>

        <h2>Method 2: IP Geolocation (Server or Client)</h2>
        <p>Get the timezone from the user&apos;s IP address:</p>
        <pre><code>{`const { timezone } = await fetch(
  "https://geo.kamero.ai/api/geo"
).then(r => r.json());

console.log(timezone); // "America/New_York"`}</code></pre>
        <p>Pros:</p>
        <ul>
          <li>Works on both server and client side</li>
          <li>Doesn&apos;t depend on the user&apos;s OS settings</li>
          <li>Returns IANA timezone name (same format as Intl API)</li>
          <li>Also gives you city, country, and coordinates as a bonus</li>
        </ul>
        <p>Cons:</p>
        <ul>
          <li>Requires a network request (~50ms)</li>
          <li>VPN users will get the VPN server&apos;s timezone</li>
          <li>Slightly less accurate than the OS setting for edge cases</li>
        </ul>

        <h2>Method 3: Date UTC Offset</h2>
        <p>The old-school approach using the Date object:</p>
        <pre><code>{`const offsetMinutes = new Date().getTimezoneOffset();
const offsetHours = -offsetMinutes / 60;
console.log(\`UTC\${offsetHours >= 0 ? "+" : ""}\${offsetHours}\`);
// "UTC-5"`}</code></pre>
        <p>Pros:</p>
        <ul>
          <li>Works everywhere, even in very old browsers</li>
          <li>No API call needed</li>
        </ul>
        <p>Cons:</p>
        <ul>
          <li>Returns an offset, not a timezone name — UTC-5 could be EST, CDT, COT, PET, or ECT</li>
          <li>Doesn&apos;t account for DST transitions</li>
          <li>Ambiguous — multiple timezones share the same offset</li>
          <li>Not useful for scheduling future events</li>
        </ul>

        <h2>Which Method Should You Use?</h2>
        <table>
          <thead>
            <tr><th>Scenario</th><th>Best Method</th><th>Why</th></tr>
          </thead>
          <tbody>
            <tr><td>Display local time in UI</td><td>Intl API</td><td>Instant, accurate, no network</td></tr>
            <tr><td>Server-side rendering</td><td>IP Geolocation</td><td>Only option on the server</td></tr>
            <tr><td>Email scheduling</td><td>IP Geolocation</td><td>Need timezone before user interacts</td></tr>
            <tr><td>Analytics / logging</td><td>IP Geolocation</td><td>Works server-side, gives extra data</td></tr>
            <tr><td>Calendar / meeting app</td><td>Intl API + user confirmation</td><td>Highest accuracy, user can correct</td></tr>
            <tr><td>Fallback / legacy</td><td>Date offset</td><td>Last resort when nothing else works</td></tr>
          </tbody>
        </table>

        <h2>Combining Methods for Best Results</h2>
        <p>
          The most robust approach uses the Intl API as the primary source and IP
          geolocation as a fallback or server-side complement:
        </p>
        <pre><code>{`async function detectTimezone() {
  // Try Intl API first (client-side only)
  if (typeof window !== "undefined") {
    const intlTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (intlTz) return intlTz;
  }

  // Fallback to IP geolocation (works anywhere)
  try {
    const { timezone } = await fetch(
      "https://geo.kamero.ai/api/geo"
    ).then(r => r.json());
    return timezone || "UTC";
  } catch {
    return "UTC";
  }
}

// Usage
const tz = await detectTimezone();
const now = new Date().toLocaleString("en-US", {
  timeZone: tz,
  dateStyle: "full",
  timeStyle: "short",
});`}</code></pre>

        <h2>Practical Example: Show Event Times Locally</h2>
        <pre><code>{`async function formatEventTime(utcTime: string) {
  const tz = await detectTimezone();
  const date = new Date(utcTime);

  return {
    local: date.toLocaleString("en-US", {
      timeZone: tz,
      dateStyle: "medium",
      timeStyle: "short",
    }),
    timezone: tz,
    offset: date.toLocaleString("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).split(" ").pop(),
  };
}

const event = await formatEventTime("2026-03-15T18:00:00Z");
// { local: "Mar 15, 2026, 1:00 PM", timezone: "America/New_York", offset: "EST" }`}</code></pre>

        <div className="blog-post-cta">
          <h3>Get Timezone from IP</h3>
          <p>The Kamero API returns IANA timezone with every request. No key needed.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
