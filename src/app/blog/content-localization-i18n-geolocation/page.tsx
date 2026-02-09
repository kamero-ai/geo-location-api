import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "Content Localization with IP Geolocation: Auto-Detect Language & Region",
  description:
    "Use IP geolocation to automatically detect visitor language and region for content localization. Covers i18n strategies, locale detection, and implementation patterns.",
  keywords: ["content localization geolocation", "i18n ip geolocation", "auto detect language ip", "locale detection ip address", "geolocation internationalization", "ip based language detection", "regional content ip", "localize website by country"],
  alternates: { canonical: "https://geo.kamero.ai/blog/content-localization-i18n-geolocation" },
  openGraph: { title: "Content Localization with IP Geolocation", description: "Auto-detect visitor language and region using IP geolocation for i18n.", url: "https://geo.kamero.ai/blog/content-localization-i18n-geolocation", type: "article", publishedTime: "2026-01-10T00:00:00Z" },
};

export default function LocalizationPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Guide</span>
        <h1>Content Localization with IP Geolocation: Auto-Detect Language &amp; Region</h1>
        <p className="post-meta">Jan 10, 2026 · 8 min read</p>

        <p>Serving content in the right language and format for each visitor is one of the highest-impact things you can do for user experience. IP geolocation gives you a reliable starting point for locale detection — before the user even interacts with your site.</p>

        <h2>Why IP-Based Locale Detection?</h2>
        <p>Browser <code>Accept-Language</code> headers are useful but not always reliable. A user in Japan might have their browser set to English. IP geolocation adds a second signal — their physical location — which helps you make smarter defaults:</p>
        <ul>
          <li>Show content in the local language</li>
          <li>Display dates, numbers, and currencies in regional formats</li>
          <li>Surface region-specific promotions or legal notices</li>
          <li>Pre-select the correct country in forms</li>
        </ul>

        <h2>Country-to-Locale Mapping</h2>
        <pre><code>{`const countryLocaleMap: Record<string, string> = {
  US: "en-US",
  GB: "en-GB",
  DE: "de-DE",
  FR: "fr-FR",
  ES: "es-ES",
  JP: "ja-JP",
  KR: "ko-KR",
  BR: "pt-BR",
  CN: "zh-CN",
  IN: "hi-IN",
  SA: "ar-SA",
  IT: "it-IT",
  NL: "nl-NL",
  RU: "ru-RU",
  TR: "tr-TR",
};

function getLocale(countryCode: string): string {
  return countryLocaleMap[countryCode] || "en-US";
}`}</code></pre>

        <h2>Detect Locale from IP</h2>
        <pre><code>{`async function detectVisitorLocale(): Promise<string> {
  const res = await fetch("https://geo.kamero.ai/api/geo");
  const { country } = await res.json();
  return getLocale(country);
}

// Usage
const locale = await detectVisitorLocale();
// "ja-JP" for a visitor in Japan`}</code></pre>

        <h2>Combine with Accept-Language Header</h2>
        <pre><code>{`function getBestLocale(
  acceptLanguage: string | null,
  geoCountry: string
): string {
  // Priority: explicit browser preference > geo
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]
      .split(";")[0].trim();
    // Check if it's a full locale (e.g., "fr-FR")
    if (preferred.includes("-")) return preferred;
  }

  // Fall back to geo-based locale
  return getLocale(geoCountry);
}`}</code></pre>
        <p>This gives you the best of both worlds: respect explicit user preferences, but use geolocation as a smart fallback.</p>

        <h2>Next.js Middleware for Auto-Locale</h2>
        <pre><code>{`// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "de", "fr", "es", "ja"];

export function middleware(request: NextRequest) {
  const country = request.geo?.country || "US";
  const countryToLang: Record<string, string> = {
    DE: "de", FR: "fr", ES: "es",
    MX: "es", JP: "ja", AT: "de", CH: "de",
  };

  const detectedLang = countryToLang[country] || "en";
  const pathname = request.nextUrl.pathname;

  // Skip if already has locale prefix
  const hasLocale = SUPPORTED_LOCALES.some(
    (l) => pathname.startsWith(\`/\${l}/\`) || pathname === \`/\${l}\`
  );
  if (hasLocale) return NextResponse.next();

  // Redirect to localized path
  const url = request.nextUrl.clone();
  url.pathname = \`/\${detectedLang}\${pathname}\`;
  return NextResponse.redirect(url);
}`}</code></pre>

        <h2>Format Dates and Numbers by Region</h2>
        <pre><code>{`function formatForLocale(locale: string) {
  const now = new Date();

  return {
    date: new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
    }).format(now),

    number: new Intl.NumberFormat(locale).format(1234567.89),

    currency: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: getCurrencyForLocale(locale),
    }).format(99.99),
  };
}

// "en-US" → { date: "February 9, 2026",
//             number: "1,234,567.89",
//             currency: "$99.99" }
// "de-DE" → { date: "9. Februar 2026",
//             number: "1.234.567,89",
//             currency: "99,99 €" }`}</code></pre>

        <h2>React Component with Geo-Locale</h2>
        <pre><code>{`"use client";
import { useState, useEffect } from "react";

export function LocalizedContent() {
  const [locale, setLocale] = useState("en-US");

  useEffect(() => {
    fetch("https://geo.kamero.ai/api/geo")
      .then(r => r.json())
      .then(({ country }) => setLocale(getLocale(country)))
      .catch(() => {}); // Keep default
  }, []);

  const messages: Record<string, { welcome: string }> = {
    "en-US": { welcome: "Welcome" },
    "es-ES": { welcome: "Bienvenido" },
    "fr-FR": { welcome: "Bienvenue" },
    "de-DE": { welcome: "Willkommen" },
    "ja-JP": { welcome: "ようこそ" },
  };

  const msg = messages[locale] || messages["en-US"];

  return (
    <div lang={locale}>
      <h1>{msg.welcome}</h1>
      <p>{new Date().toLocaleDateString(locale)}</p>
    </div>
  );
}`}</code></pre>

        <h2>Best Practices</h2>
        <ul>
          <li>Always let users override the detected locale with a language switcher</li>
          <li>Store the user&apos;s preference in a cookie or localStorage</li>
          <li>Use geo as a default, not a lock — some users travel or use VPNs</li>
          <li>Combine <code>Accept-Language</code> + geo for the most accurate detection</li>
          <li>Cache the geo lookup to avoid repeated API calls on navigation</li>
          <li>Test with users from different regions to validate your mappings</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Get Started</h3>
          <p>Detect your visitors&apos; country instantly with a free API — no key required.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}