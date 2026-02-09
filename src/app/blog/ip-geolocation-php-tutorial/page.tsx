import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in PHP: Get Visitor Location (Free API Tutorial)",
  description:
    "Learn how to detect visitor location by IP address in PHP using a free geolocation API. Covers file_get_contents, cURL, Laravel integration, WordPress, and caching strategies.",
  keywords: [
    "php ip geolocation",
    "php get visitor location",
    "php ip to city",
    "php geolocation api",
    "laravel ip geolocation",
    "wordpress ip location",
    "php detect country ip",
    "php curl geolocation",
    "free ip api php",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-php-tutorial" },
  openGraph: {
    title: "IP Geolocation in PHP (Free API Tutorial)",
    description: "Detect visitor location by IP in PHP with code examples for Laravel and WordPress.",
    url: "https://geo.kamero.ai/blog/ip-geolocation-php-tutorial",
    type: "article",
    publishedTime: "2026-01-24T00:00:00Z",
  },
};

export default function PHPTutorialPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in PHP: Get Visitor Location with a Free API</h1>
        <p className="post-meta">Jan 24, 2026 · 8 min read</p>

        <p>
          PHP powers a huge portion of the web — WordPress alone runs over 40% of all
          websites. If you need to detect visitor location in PHP, here&apos;s how to do
          it with a free API that requires no key and no registration.
        </p>

        <h2>Quick Start: file_get_contents</h2>
        <p>The simplest approach — one function call:</p>
        <pre><code>{`<?php
$response = file_get_contents("https://geo.kamero.ai/api/geo");
$location = json_decode($response, true);

echo "IP: " . $location["ip"] . "\\n";
echo "City: " . $location["city"] . "\\n";
echo "Country: " . $location["country"] . "\\n";
echo "Timezone: " . $location["timezone"] . "\\n";
echo "Coordinates: " . $location["latitude"] . ", " . $location["longitude"];
?>`}</code></pre>

        <h2>Using cURL (More Control)</h2>
        <p>For production use, cURL gives you timeout control and error handling:</p>
        <pre><code>{`<?php
function getGeolocation(): ?array {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => "https://geo.kamero.ai/api/geo",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_HTTPHEADER => ["Accept: application/json"],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200 || !$response) {
        return null;
    }

    return json_decode($response, true);
}

$geo = getGeolocation();
if ($geo) {
    echo "Welcome from {$geo['city']}, {$geo['country']}!";
} else {
    echo "Welcome!";
}
?>`}</code></pre>

        <h2>Laravel Integration</h2>
        <p>Create a service class and use it across your Laravel app:</p>
        <pre><code>{`<?php
// app/Services/GeoLocationService.php
namespace App\\Services;

use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Cache;

class GeoLocationService
{
    public function detect(): ?array
    {
        return Cache::remember("geo:" . request()->ip(), 3600, function () {
            try {
                $response = Http::timeout(5)
                    ->get("https://geo.kamero.ai/api/geo");

                return $response->successful() ? $response->json() : null;
            } catch (\\Exception $e) {
                return null;
            }
        });
    }

    public function getCountry(): string
    {
        return $this->detect()["country"] ?? "US";
    }

    public function getTimezone(): string
    {
        return $this->detect()["timezone"] ?? "UTC";
    }
}

// Usage in a controller:
class HomeController extends Controller
{
    public function index(GeoLocationService $geo)
    {
        $location = $geo->detect();

        return view("home", [
            "city" => $location["city"] ?? "there",
            "country" => $location["country"] ?? null,
        ]);
    }
}
?>`}</code></pre>

        <h2>Laravel Middleware</h2>
        <p>Automatically attach location data to every request:</p>
        <pre><code>{`<?php
// app/Http/Middleware/DetectLocation.php
namespace App\\Http\\Middleware;

use App\\Services\\GeoLocationService;
use Closure;

class DetectLocation
{
    public function __construct(private GeoLocationService $geo) {}

    public function handle($request, Closure $next)
    {
        $location = $this->geo->detect();
        $request->merge(["geo" => $location]);

        return $next($request);
    }
}

// Then in any controller:
$city = $request->input("geo.city");
$country = $request->input("geo.country");
?>`}</code></pre>

        <h2>WordPress: Detect Visitor Location</h2>
        <p>Add geolocation to your WordPress theme or plugin:</p>
        <pre><code>{`<?php
// In your theme's functions.php or a custom plugin

function kamero_get_visitor_location() {
    // Check transient cache first
    $ip = $_SERVER["REMOTE_ADDR"] ?? "";
    $cache_key = "geo_" . md5($ip);
    $cached = get_transient($cache_key);

    if ($cached !== false) {
        return $cached;
    }

    $response = wp_remote_get("https://geo.kamero.ai/api/geo", [
        "timeout" => 5,
    ]);

    if (is_wp_error($response)) {
        return null;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    // Cache for 1 hour
    set_transient($cache_key, $data, HOUR_IN_SECONDS);

    return $data;
}

// Usage in a template
$location = kamero_get_visitor_location();
if ($location) {
    echo "<p>Shipping to " . esc_html($location["city"]) . "? ";
    echo "We deliver to " . esc_html($location["country"]) . "!</p>";
}
?>`}</code></pre>

        <h2>Caching Strategies</h2>
        <p>
          For high-traffic PHP sites, always cache geolocation results. The visitor&apos;s
          location doesn&apos;t change during a session:
        </p>
        <pre><code>{`<?php
// Session-based caching
session_start();

function getGeoWithCache(): array {
    if (isset($_SESSION["geo_data"])) {
        return $_SESSION["geo_data"];
    }

    $response = file_get_contents("https://geo.kamero.ai/api/geo");
    $data = json_decode($response, true) ?: [];

    $_SESSION["geo_data"] = $data;
    return $data;
}

// Redis caching (for multi-server setups)
function getGeoRedis(string $ip): array {
    $redis = new Redis();
    $redis->connect("127.0.0.1");

    $cached = $redis->get("geo:{$ip}");
    if ($cached) {
        return json_decode($cached, true);
    }

    $response = file_get_contents("https://geo.kamero.ai/api/geo");
    $data = json_decode($response, true) ?: [];

    $redis->setex("geo:{$ip}", 3600, json_encode($data));
    return $data;
}
?>`}</code></pre>

        <div className="blog-post-cta">
          <h3>Try the API from PHP</h3>
          <p>No API key, no composer package needed. Just HTTP.</p>
          <Link href="/docs#php" className="cta-btn">PHP Examples →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
