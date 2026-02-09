import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in Python: Get Location from IP Address (2026 Guide)",
  description:
    "Learn how to get geolocation data from IP addresses in Python using free APIs. Covers requests library, Flask integration, Django middleware, error handling, and batch lookups.",
  keywords: [
    "python ip geolocation",
    "python get location from ip",
    "ip address location python",
    "python geolocation api",
    "flask ip geolocation",
    "django ip location",
    "python requests ip lookup",
    "free ip geolocation python",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-python-tutorial" },
  openGraph: {
    title: "IP Geolocation in Python (2026 Guide)",
    description: "Complete tutorial on getting location data from IP addresses in Python.",
    url: "https://geo.kamero.ai/blog/ip-geolocation-python-tutorial",
    type: "article",
    publishedTime: "2026-02-04T00:00:00Z",
  },
};

export default function PythonTutorialPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in Python: Get Location from IP Address</h1>
        <p className="post-meta">Feb 4, 2026 · 9 min read</p>

        <p>
          Python is one of the most popular languages for backend development, data analysis, and
          scripting. Getting geolocation data from an IP address is a common task — whether
          you&apos;re building analytics dashboards, personalizing content, or logging visitor
          geography. This guide covers every approach.
        </p>

        <h2>The Simple Way: requests + Free API</h2>
        <p>The fastest way to get started — no API key, no library installation beyond <code>requests</code>:</p>
        <pre><code>{`import requests

response = requests.get("https://geo.kamero.ai/api/geo")
data = response.json()

print(f"IP: {data['ip']}")
print(f"City: {data['city']}")
print(f"Country: {data['country']}")
print(f"Timezone: {data['timezone']}")
print(f"Coordinates: {data['latitude']}, {data['longitude']}")`}</code></pre>
        <p>
          This returns 10 fields: <code>ip</code>, <code>city</code>, <code>country</code>,
          {" "}<code>countryRegion</code>, <code>continent</code>, <code>latitude</code>,
          {" "}<code>longitude</code>, <code>timezone</code>, <code>postalCode</code>, and <code>region</code>.
        </p>

        <h2>With Error Handling</h2>
        <pre><code>{`import requests

def get_geolocation():
    try:
        response = requests.get(
            "https://geo.kamero.ai/api/geo",
            timeout=5
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Geolocation error: {e}")
        return None

location = get_geolocation()
if location:
    print(f"Welcome from {location.get('city', 'Unknown')}!")`}</code></pre>

        <h2>Flask Integration</h2>
        <p>Add visitor location to your Flask app:</p>
        <pre><code>{`from flask import Flask, request, jsonify
import requests as http_requests

app = Flask(__name__)

def get_visitor_location(ip_address):
    """Get location for a specific IP."""
    try:
        # For production, you'd forward the client IP
        resp = http_requests.get(
            "https://geo.kamero.ai/api/geo",
            timeout=5
        )
        return resp.json()
    except Exception:
        return None

@app.route("/")
def home():
    location = get_visitor_location(request.remote_addr)
    city = location.get("city", "there") if location else "there"
    return f"<h1>Hello from {city}!</h1>"

@app.route("/api/visitor-info")
def visitor_info():
    location = get_visitor_location(request.remote_addr)
    return jsonify(location or {"error": "Could not detect location"})`}</code></pre>

        <h2>Django Middleware</h2>
        <p>Automatically attach location data to every request in Django:</p>
        <pre><code>{`# middleware.py
import requests

class GeoLocationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            resp = requests.get(
                "https://geo.kamero.ai/api/geo",
                timeout=3
            )
            request.geo = resp.json()
        except Exception:
            request.geo = {}

        return self.get_response(request)

# settings.py
MIDDLEWARE = [
    "yourapp.middleware.GeoLocationMiddleware",
    # ... other middleware
]

# views.py
def dashboard(request):
    city = request.geo.get("city", "Unknown")
    country = request.geo.get("country", "Unknown")
    # Use location data in your view`}</code></pre>

        <h2>Caching Results</h2>
        <p>
          For high-traffic apps, cache geolocation results to avoid redundant API calls:
        </p>
        <pre><code>{`from functools import lru_cache
import requests

@lru_cache(maxsize=1000)
def get_location_cached(ip: str) -> dict:
    """Cache location lookups by IP."""
    try:
        resp = requests.get(
            "https://geo.kamero.ai/api/geo",
            timeout=5
        )
        return resp.json()
    except Exception:
        return {}

# Or with Redis for distributed caching
import redis
import json

r = redis.Redis()

def get_location_redis(ip: str) -> dict:
    cached = r.get(f"geo:{ip}")
    if cached:
        return json.loads(cached)

    resp = requests.get("https://geo.kamero.ai/api/geo", timeout=5)
    data = resp.json()
    r.setex(f"geo:{ip}", 3600, json.dumps(data))  # Cache 1 hour
    return data`}</code></pre>

        <h2>Data Analysis with pandas</h2>
        <p>If you&apos;re analyzing visitor data, combine geolocation with pandas:</p>
        <pre><code>{`import pandas as pd
import requests

# Assume you have a list of visitor IPs
visitor_ips = ["203.0.113.1", "198.51.100.2", "192.0.2.3"]

def lookup_ip(ip):
    try:
        resp = requests.get("https://geo.kamero.ai/api/geo", timeout=5)
        return resp.json()
    except Exception:
        return {}

# Build a DataFrame
records = [lookup_ip(ip) for ip in visitor_ips]
df = pd.DataFrame(records)

# Analyze
print(df[["city", "country", "continent"]].value_counts())
print(f"\\nUnique countries: {df['country'].nunique()}")
print(f"Most common city: {df['city'].mode()[0]}")`}</code></pre>

        <h2>Alternative: Self-Host for Full Control</h2>
        <p>
          For Python backends that need guaranteed uptime and zero external dependencies,
          you can deploy your own Kamero Geo API instance to Vercel and point your Python
          code at your own endpoint:
        </p>
        <pre><code>{`# Deploy your own instance, then:
GEO_API_URL = "https://geo.yourdomain.com/api/geo"

response = requests.get(GEO_API_URL, timeout=5)
location = response.json()`}</code></pre>

        <div className="blog-post-cta">
          <h3>Try the API Now</h3>
          <p>No API key needed. Works with any Python HTTP library.</p>
          <Link href="/docs#python" className="cta-btn">Python Examples →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
