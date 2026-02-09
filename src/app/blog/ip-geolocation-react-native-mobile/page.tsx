import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../../components/ThemeProvider";
import "../blog.css";

export const metadata: Metadata = {
  title: "IP Geolocation in React Native: Detect User Location Without Permissions",
  description:
    "Use IP geolocation in React Native to detect approximate user location without requesting GPS permissions. Covers fetch, custom hooks, and combining with native geolocation.",
  keywords: ["react native ip geolocation", "react native location without permission", "react native detect country", "react native ip address location", "mobile app geolocation api", "react native timezone detection", "ip location react native", "react native no gps permission"],
  alternates: { canonical: "https://geo.kamero.ai/blog/ip-geolocation-react-native-mobile" },
  openGraph: { title: "IP Geolocation in React Native", description: "Detect user location in React Native without GPS permissions.", url: "https://geo.kamero.ai/blog/ip-geolocation-react-native-mobile", type: "article", publishedTime: "2026-01-12T00:00:00Z" },
};

export default function ReactNativePost() {
  return (
    <div className="blog-post-container">
      <header className="blog-post-header">
        <Link href="/"><Image src="/kamero_logo.svg" alt="Kamero" width={140} height={35} /></Link>
        <nav className="blog-post-nav"><Link href="/blog">Blog</Link><Link href="/docs">Docs</Link><ThemeToggle /></nav>
      </header>
      <article className="blog-post-content">
        <span className="post-tag">Tutorial</span>
        <h1>IP Geolocation in React Native: Detect Location Without Permissions</h1>
        <p className="post-meta">Jan 12, 2026 · 7 min read</p>

        <p>Requesting location permissions in mobile apps creates friction. Many users deny the prompt, and app stores scrutinize why you need it. IP geolocation gives you approximate location (city, country, timezone) without any permission dialog.</p>

        <h2>When to Use IP vs GPS</h2>
        <table>
          <thead><tr><th>Need</th><th>Use IP Geolocation</th><th>Use GPS</th></tr></thead>
          <tbody>
            <tr><td>Show local currency</td><td>✅</td><td>Overkill</td></tr>
            <tr><td>Set timezone</td><td>✅</td><td>Overkill</td></tr>
            <tr><td>Personalize content</td><td>✅</td><td>Overkill</td></tr>
            <tr><td>Navigation/maps</td><td>❌</td><td>✅</td></tr>
            <tr><td>Delivery tracking</td><td>❌</td><td>✅</td></tr>
            <tr><td>Nearby search</td><td>Rough estimate</td><td>✅</td></tr>
          </tbody>
        </table>

        <h2>Basic Fetch</h2>
        <pre><code>{`const getLocation = async () => {
  try {
    const response = await fetch("https://geo.kamero.ai/api/geo");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Geolocation failed:", error);
    return null;
  }
};

// Returns: { ip, city, country, timezone, latitude, longitude, ... }`}</code></pre>

        <h2>Custom Hook: useIPLocation</h2>
        <pre><code>{`import { useState, useEffect } from "react";

interface IPLocation {
  ip: string;
  city: string;
  country: string;
  countryRegion: string;
  continent: string;
  latitude: string;
  longitude: string;
  timezone: string;
  postalCode: string;
}

export function useIPLocation() {
  const [location, setLocation] = useState<IPLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("https://geo.kamero.ai/api/geo")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setLocation(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { location, loading, error };
}`}</code></pre>

        <h2>Usage in a Component</h2>
        <pre><code>{`import { View, Text, ActivityIndicator } from "react-native";
import { useIPLocation } from "./hooks/useIPLocation";

export default function WelcomeScreen() {
  const { location, loading } = useIPLocation();

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>
        Welcome from {location?.city || "there"}!
      </Text>
      <Text style={{ color: "#666" }}>
        {location?.country} · {location?.timezone}
      </Text>
    </View>
  );
}`}</code></pre>

        <h2>Progressive Enhancement: IP First, Then GPS</h2>
        <p>Start with IP geolocation for instant results, then upgrade to GPS if the user grants permission:</p>
        <pre><code>{`import * as Location from "expo-location";

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [source, setSource] = useState<"ip" | "gps">("ip");

  useEffect(() => {
    // Step 1: Instant IP-based location
    fetch("https://geo.kamero.ai/api/geo")
      .then(r => r.json())
      .then(data => {
        setLocation({
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city,
          country: data.country,
        });
        setSource("ip");
      });

    // Step 2: Try GPS (non-blocking)
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setSource("gps");
      }
    })();
  }, []);

  return { location, source };
}`}</code></pre>

        <h2>Caching the Result</h2>
        <pre><code>{`import AsyncStorage from "@react-native-async-storage/async-storage";

async function getCachedLocation() {
  const cached = await AsyncStorage.getItem("ip_location");
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Cache for 1 hour
    if (Date.now() - timestamp < 3600000) return data;
  }

  const response = await fetch("https://geo.kamero.ai/api/geo");
  const data = await response.json();

  await AsyncStorage.setItem("ip_location", JSON.stringify({
    data,
    timestamp: Date.now(),
  }));

  return data;
}`}</code></pre>

        <h2>Common Use Cases in Mobile Apps</h2>
        <ul>
          <li><strong>Onboarding</strong> — Pre-select country and language during first launch</li>
          <li><strong>Currency</strong> — Show prices in local currency without asking</li>
          <li><strong>Timezone</strong> — Schedule notifications in the user&apos;s local time</li>
          <li><strong>Content</strong> — Show region-specific promotions or news</li>
          <li><strong>Analytics</strong> — Track user geography without invasive permissions</li>
        </ul>

        <div className="blog-post-cta">
          <h3>No Permissions Required</h3>
          <p>Get city, country, and timezone from any mobile app. Free API, no key.</p>
          <Link href="/docs" className="cta-btn">View Documentation →</Link>
        </div>
      </article>
      <footer className="blog-footer"><p>© 2026 Kamero AI · MIT License</p></footer>
    </div>
  );
}
