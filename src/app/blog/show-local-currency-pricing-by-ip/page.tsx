import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "How to Show Local Currency and Pricing Based on Visitor IP Location",
  description:
    "Learn how to display prices in your visitor's local currency using IP geolocation. Covers country-to-currency mapping, formatting with Intl, and purchasing power parity pricing.",
  keywords: [
    "show local currency by ip",
    "ip geolocation currency",
    "display prices local currency",
    "geo pricing website",
    "purchasing power parity pricing",
    "country based pricing",
    "localized pricing ip",
    "currency by country api",
    "dynamic pricing geolocation",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/show-local-currency-pricing-by-ip" },
  openGraph: {
    title: "Show Local Currency Pricing by Visitor IP",
    description: "Display prices in your visitor's local currency using IP geolocation.",
    url: "https://geo.kamero.ai/blog/show-local-currency-pricing-by-ip",
    type: "article",
    publishedTime: "2026-01-26T00:00:00Z",
  },
};

export default function CurrencyPricingPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>How to Show Local Currency and Pricing Based on Visitor IP</h1>
        <p className="post-meta">Jan 26, 2026 · 7 min read</p>

        <p>
          Showing prices in a visitor&apos;s local currency can significantly improve
          conversion rates. A user in Japan seeing &quot;¥1,500&quot; instead of &quot;$9.99&quot;
          immediately understands the cost without mental math. Here&apos;s how to implement
          it using IP geolocation.
        </p>

        <h2>Step 1: Detect the Visitor&apos;s Country</h2>
        <pre><code>{`const { country } = await fetch(
  "https://geo.kamero.ai/api/geo"
).then(r => r.json());

// country = "JP" (ISO 3166-1 alpha-2)`}</code></pre>

        <h2>Step 2: Map Country to Currency</h2>
        <pre><code>{`const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD", CA: "CAD", GB: "GBP", EU: "EUR",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
  JP: "JPY", CN: "CNY", IN: "INR", BR: "BRL",
  AU: "AUD", KR: "KRW", MX: "MXN", SE: "SEK",
  CH: "CHF", SG: "SGD", HK: "HKD", NZ: "NZD",
  // Add more as needed
};

// Eurozone countries
const EUROZONE = new Set([
  "AT","BE","CY","EE","FI","FR","DE","GR",
  "IE","IT","LV","LT","LU","MT","NL","PT",
  "SK","SI","ES"
]);

function getCurrency(countryCode: string): string {
  if (EUROZONE.has(countryCode)) return "EUR";
  return COUNTRY_CURRENCY[countryCode] || "USD";
}`}</code></pre>

        <h2>Step 3: Format Prices with Intl.NumberFormat</h2>
        <p>
          JavaScript&apos;s built-in <code>Intl.NumberFormat</code> handles currency
          symbols, decimal separators, and grouping for you:
        </p>
        <pre><code>{`function formatPrice(
  amountUSD: number,
  currency: string,
  exchangeRate: number
): string {
  const localAmount = amountUSD * exchangeRate;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(localAmount);
}

// Examples:
formatPrice(9.99, "JPY", 150);  // "¥1,499"
formatPrice(9.99, "EUR", 0.92); // "€9.19"
formatPrice(9.99, "GBP", 0.79); // "£7.89"
formatPrice(9.99, "INR", 83);   // "₹829.17"`}</code></pre>

        <h2>Putting It All Together</h2>
        <pre><code>{`// Exchange rates (fetch from your preferred source)
const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150,
  INR: 83, BRL: 4.97, CAD: 1.36, AUD: 1.53,
  CNY: 7.24, KRW: 1320, MXN: 17.1, SEK: 10.5,
};

async function getLocalizedPrice(amountUSD: number) {
  const { country } = await fetch(
    "https://geo.kamero.ai/api/geo"
  ).then(r => r.json());

  const currency = getCurrency(country);
  const rate = RATES[currency] || 1;

  return {
    formatted: formatPrice(amountUSD, currency, rate),
    currency,
    country,
    localAmount: amountUSD * rate,
  };
}

// Usage
const price = await getLocalizedPrice(29.99);
// { formatted: "¥4,499", currency: "JPY", country: "JP", localAmount: 4498.5 }`}</code></pre>

        <h2>Purchasing Power Parity (PPP) Pricing</h2>
        <p>
          Beyond currency conversion, many SaaS companies offer PPP pricing — adjusting
          the actual price based on the local cost of living. A $29/month plan might be
          $9/month in India or $15/month in Brazil.
        </p>
        <pre><code>{`const PPP_DISCOUNTS: Record<string, number> = {
  IN: 0.30,  // 70% discount
  BR: 0.50,  // 50% discount
  MX: 0.50,
  PL: 0.60,
  TR: 0.40,
  PH: 0.35,
  NG: 0.30,
  // Countries not listed get full price
};

function getPPPPrice(baseUSD: number, country: string) {
  const multiplier = PPP_DISCOUNTS[country] || 1;
  const adjustedUSD = baseUSD * multiplier;
  const currency = getCurrency(country);
  const rate = RATES[currency] || 1;

  return {
    original: formatPrice(baseUSD, "USD", 1),
    adjusted: formatPrice(adjustedUSD, currency, rate),
    discount: multiplier < 1
      ? \`\${Math.round((1 - multiplier) * 100)}% PPP discount\`
      : null,
  };
}

// For a visitor from India:
// { original: "$29.99", adjusted: "₹747", discount: "70% PPP discount" }`}</code></pre>

        <h2>React Component Example</h2>
        <pre><code>{`function PricingCard({ planName, basePrice }: {
  planName: string;
  basePrice: number;
}) {
  const [price, setPrice] = useState<string | null>(null);
  const [discount, setDiscount] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://geo.kamero.ai/api/geo")
      .then(r => r.json())
      .then(({ country }) => {
        const ppp = getPPPPrice(basePrice, country);
        setPrice(ppp.adjusted);
        setDiscount(ppp.discount);
      })
      .catch(() => setPrice(\`$\${basePrice}\`));
  }, [basePrice]);

  return (
    <div className="pricing-card">
      <h3>{planName}</h3>
      <p className="price">{price || \`$\${basePrice}\`}</p>
      <p className="period">per month</p>
      {discount && <span className="badge">{discount}</span>}
    </div>
  );
}`}</code></pre>

        <h2>Tips</h2>
        <ul>
          <li><strong>Cache exchange rates</strong> — Don&apos;t fetch them on every request. Update daily or hourly.</li>
          <li><strong>Show both currencies</strong> — Display the local price with the USD equivalent in smaller text for transparency.</li>
          <li><strong>Let users switch</strong> — Always provide a currency selector as an override.</li>
          <li><strong>Round nicely</strong> — ¥1,499 looks better than ¥1,498.50. Use charm pricing in each currency.</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Detect Visitor Country Instantly</h3>
          <p>Free API returns country code with every request. No key needed.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
