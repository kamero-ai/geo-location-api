import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in C# .NET: Get Location from IP Address (2026 Guide)",
  description:
    "Learn how to get geolocation data from IP addresses in C# and .NET using a free API. Covers HttpClient, ASP.NET Core middleware, dependency injection, and caching.",
  keywords: ["csharp ip geolocation", "dotnet ip location", "asp.net core geolocation", "c# get location from ip", "ip geolocation api csharp", ".net ip lookup", "c# httpClient geolocation", "asp.net middleware ip location"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-csharp-dotnet-tutorial" },
  openGraph: { title: "IP Geolocation in C# .NET", description: "Get location from IP addresses in C# using a free geolocation API.", url: "https://geo.kamero.ai/blog/ip-geolocation-csharp-dotnet-tutorial", type: "article", publishedTime: "2026-01-14T00:00:00Z" },
};

export default function CSharpPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in C# .NET: Get Location from IP Address</h1>
        <p className="post-meta">Jan 14, 2026 · 9 min read</p>

        <p>C# and .NET power a huge portion of enterprise web applications. Adding IP geolocation lets you personalize content, detect fraud, and comply with regional regulations. This guide covers everything from basic HTTP calls to production-ready ASP.NET Core middleware.</p>

        <h2>Basic HttpClient Request</h2>
        <pre><code>{`using System.Net.Http.Json;

var client = new HttpClient();
var geo = await client.GetFromJsonAsync<GeoResponse>(
    "https://geo.kamero.ai/api/geo"
);

Console.WriteLine($"{geo.City}, {geo.Country} ({geo.Timezone})");

public record GeoResponse(
    string Ip, string City, string Country,
    string CountryRegion, string Continent,
    string Latitude, string Longitude,
    string Timezone, string PostalCode, string Region
);`}</code></pre>
        <p>The <code>GetFromJsonAsync</code> method handles both the HTTP request and JSON deserialization in one call. Using a <code>record</code> type keeps the model clean and immutable.</p>

        <h2>Create a Geolocation Service</h2>
        <pre><code>{`public interface IGeoLocationService
{
    Task<GeoResponse?> GetLocationAsync(
        CancellationToken ct = default);
}

public class GeoLocationService : IGeoLocationService
{
    private readonly HttpClient _http;

    public GeoLocationService(HttpClient http)
    {
        _http = http;
        _http.BaseAddress = new Uri("https://geo.kamero.ai");
        _http.Timeout = TimeSpan.FromSeconds(5);
    }

    public async Task<GeoResponse?> GetLocationAsync(
        CancellationToken ct = default)
    {
        try
        {
            return await _http.GetFromJsonAsync<GeoResponse>(
                "/api/geo", ct);
        }
        catch (HttpRequestException ex)
        {
            Console.Error.WriteLine(
                $"Geo lookup failed: {ex.Message}");
            return null;
        }
    }
}`}</code></pre>

        <h2>Register with Dependency Injection</h2>
        <pre><code>{`// Program.cs
builder.Services.AddHttpClient<IGeoLocationService,
    GeoLocationService>();

// In a controller or Razor Page:
public class HomeController : Controller
{
    private readonly IGeoLocationService _geo;

    public HomeController(IGeoLocationService geo)
        => _geo = geo;

    public async Task<IActionResult> Index()
    {
        var location = await _geo.GetLocationAsync();
        ViewBag.City = location?.City ?? "Unknown";
        return View();
    }
}`}</code></pre>
        <p>Using <code>AddHttpClient</code> gives you automatic <code>HttpClient</code> lifecycle management through <code>IHttpClientFactory</code>, avoiding socket exhaustion issues.</p>

        <h2>Add In-Memory Caching</h2>
        <pre><code>{`public class CachedGeoService : IGeoLocationService
{
    private readonly IGeoLocationService _inner;
    private readonly IMemoryCache _cache;

    public CachedGeoService(
        IGeoLocationService inner, IMemoryCache cache)
    {
        _inner = inner;
        _cache = cache;
    }

    public async Task<GeoResponse?> GetLocationAsync(
        CancellationToken ct = default)
    {
        return await _cache.GetOrCreateAsync(
            "geo_location",
            async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow =
                    TimeSpan.FromMinutes(10);
                return await _inner.GetLocationAsync(ct);
            });
    }
}

// Register in DI:
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient<GeoLocationService>();
builder.Services.Decorate<IGeoLocationService,
    CachedGeoService>();`}</code></pre>

        <h2>ASP.NET Core Middleware</h2>
        <pre><code>{`public class GeoLocationMiddleware
{
    private readonly RequestDelegate _next;

    public GeoLocationMiddleware(RequestDelegate next)
        => _next = next;

    public async Task InvokeAsync(
        HttpContext context, IGeoLocationService geo)
    {
        var location = await geo.GetLocationAsync();
        if (location != null)
        {
            context.Items["GeoCountry"] = location.Country;
            context.Items["GeoCity"] = location.City;
            context.Items["GeoTimezone"] = location.Timezone;
        }
        await _next(context);
    }
}

// In Program.cs:
app.UseMiddleware<GeoLocationMiddleware>();`}</code></pre>
        <p>This middleware runs on every request and stores location data in <code>HttpContext.Items</code>, making it available to all downstream handlers.</p>

        <h2>Minimal API Example</h2>
        <pre><code>{`app.MapGet("/my-location", async (IGeoLocationService geo) =>
{
    var location = await geo.GetLocationAsync();
    return location is not null
        ? Results.Ok(location)
        : Results.Problem("Could not determine location");
});`}</code></pre>

        <h2>Geo-Based Access Control</h2>
        <pre><code>{`public class GeoBlockAttribute : ActionFilterAttribute
{
    private readonly string[] _blockedCountries;

    public GeoBlockAttribute(params string[] countries)
        => _blockedCountries = countries;

    public override async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next)
    {
        var geo = context.HttpContext
            .RequestServices
            .GetRequiredService<IGeoLocationService>();

        var location = await geo.GetLocationAsync();

        if (location != null &&
            _blockedCountries.Contains(location.Country))
        {
            context.Result = new StatusCodeResult(403);
            return;
        }

        await next();
    }
}

// Usage:
[GeoBlock("CN", "RU")]
public IActionResult SensitiveData() => View();`}</code></pre>

        <h2>Key Takeaways</h2>
        <ul>
          <li>Use <code>IHttpClientFactory</code> via DI to avoid socket exhaustion</li>
          <li>Cache responses to reduce latency and external API calls</li>
          <li>Middleware makes location data available app-wide</li>
          <li>Records provide clean, immutable data models</li>
          <li>Always handle timeouts and failures gracefully</li>
        </ul>

        <div className="blog-post-cta">
          <h3>Try the API</h3>
          <p>Get started with a free geolocation API — no API key needed.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}