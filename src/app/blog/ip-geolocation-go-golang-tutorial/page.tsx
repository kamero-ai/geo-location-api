import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in Go: Get Location from IP Address (Golang Tutorial)",
  description:
    "Learn how to get geolocation data from IP addresses in Go using a free API. Covers net/http, JSON parsing, Gin middleware, concurrent lookups, and caching patterns.",
  keywords: [
    "golang ip geolocation",
    "go get location from ip",
    "go geolocation api",
    "golang ip to city",
    "gin middleware geolocation",
    "go ip address lookup",
    "golang detect country",
    "go http geolocation",
    "free ip api golang",
  ],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-go-golang-tutorial" },
  openGraph: {
    title: "IP Geolocation in Go (Golang Tutorial)",
    description: "Get location data from IP addresses in Go with code examples.",
    url: "https://geo.kamero.ai/blog/ip-geolocation-go-golang-tutorial",
    type: "article",
    publishedTime: "2026-01-20T00:00:00Z",
  },
};

export default function GoTutorialPost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in Go: Get Location from IP Address</h1>
        <p className="post-meta">Jan 20, 2026 · 7 min read</p>

        <p>
          Go is a popular choice for building APIs, microservices, and backend systems.
          Adding IP geolocation to your Go application is straightforward with a free
          API — no external packages needed beyond the standard library.
        </p>

        <h2>Basic Example: net/http</h2>
        <pre><code>{`package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "time"
)

type GeoLocation struct {
    IP            string \`json:"ip"\`
    City          string \`json:"city"\`
    Country       string \`json:"country"\`
    CountryRegion string \`json:"countryRegion"\`
    Continent     string \`json:"continent"\`
    Latitude      string \`json:"latitude"\`
    Longitude     string \`json:"longitude"\`
    Timezone      string \`json:"timezone"\`
    PostalCode    string \`json:"postalCode"\`
    Region        string \`json:"region"\`
}

func getGeolocation() (*GeoLocation, error) {
    client := &http.Client{Timeout: 5 * time.Second}

    resp, err := client.Get("https://geo.kamero.ai/api/geo")
    if err != nil {
        return nil, fmt.Errorf("request failed: %w", err)
    }
    defer resp.Body.Close()

    var geo GeoLocation
    if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
        return nil, fmt.Errorf("decode failed: %w", err)
    }

    return &geo, nil
}

func main() {
    geo, err := getGeolocation()
    if err != nil {
        fmt.Printf("Error: %v\\n", err)
        return
    }

    fmt.Printf("IP: %s\\n", geo.IP)
    fmt.Printf("City: %s\\n", geo.City)
    fmt.Printf("Country: %s\\n", geo.Country)
    fmt.Printf("Timezone: %s\\n", geo.Timezone)
    fmt.Printf("Coordinates: %s, %s\\n", geo.Latitude, geo.Longitude)
}`}</code></pre>

        <h2>Gin Middleware</h2>
        <p>
          If you&apos;re using Gin, add geolocation as middleware so it&apos;s available
          in every handler:
        </p>
        <pre><code>{`package middleware

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
)

func GeoLocation() gin.HandlerFunc {
    client := &http.Client{Timeout: 5 * time.Second}

    return func(c *gin.Context) {
        resp, err := client.Get("https://geo.kamero.ai/api/geo")
        if err != nil {
            c.Set("geo", nil)
            c.Next()
            return
        }
        defer resp.Body.Close()

        var geo map[string]interface{}
        json.NewDecoder(resp.Body).Decode(&geo)
        c.Set("geo", geo)
        c.Next()
    }
}

// Usage:
// r := gin.Default()
// r.Use(middleware.GeoLocation())
//
// r.GET("/", func(c *gin.Context) {
//     geo, _ := c.Get("geo")
//     c.JSON(200, geo)
// })`}</code></pre>

        <h2>With In-Memory Caching</h2>
        <p>
          Cache results using <code>sync.Map</code> to avoid redundant API calls:
        </p>
        <pre><code>{`package geo

import (
    "encoding/json"
    "net/http"
    "sync"
    "time"
)

type CachedGeo struct {
    Data      *GeoLocation
    ExpiresAt time.Time
}

var (
    cache  sync.Map
    client = &http.Client{Timeout: 5 * time.Second}
)

func Lookup(ip string) (*GeoLocation, error) {
    // Check cache
    if cached, ok := cache.Load(ip); ok {
        entry := cached.(*CachedGeo)
        if time.Now().Before(entry.ExpiresAt) {
            return entry.Data, nil
        }
        cache.Delete(ip)
    }

    // Fetch from API
    resp, err := client.Get("https://geo.kamero.ai/api/geo")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var geo GeoLocation
    if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
        return nil, err
    }

    // Cache for 1 hour
    cache.Store(ip, &CachedGeo{
        Data:      &geo,
        ExpiresAt: time.Now().Add(time.Hour),
    })

    return &geo, nil
}`}</code></pre>

        <h2>Concurrent Lookups</h2>
        <p>
          Go&apos;s goroutines make it easy to look up multiple IPs concurrently:
        </p>
        <pre><code>{`func lookupBatch(ips []string) []*GeoLocation {
    results := make([]*GeoLocation, len(ips))
    var wg sync.WaitGroup

    for i, ip := range ips {
        wg.Add(1)
        go func(idx int, addr string) {
            defer wg.Done()
            geo, err := Lookup(addr)
            if err == nil {
                results[idx] = geo
            }
        }(i, ip)
    }

    wg.Wait()
    return results
}`}</code></pre>

        <h2>HTTP Handler: Expose as Your Own API</h2>
        <p>
          Wrap the geolocation lookup in your own HTTP handler:
        </p>
        <pre><code>{`func geoHandler(w http.ResponseWriter, r *http.Request) {
    geo, err := getGeolocation()
    if err != nil {
        http.Error(w, "Failed to get location", 500)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "*")
    json.NewEncoder(w).Encode(geo)
}

func main() {
    http.HandleFunc("/api/location", geoHandler)
    fmt.Println("Server running on :8080")
    http.ListenAndServe(":8080", nil)
}`}</code></pre>

        <div className="blog-post-cta">
          <h3>Try the API</h3>
          <p>Standard JSON response. Works with any Go HTTP client.</p>
          <Link href="/docs#go" className="cta-btn">Go Examples →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
