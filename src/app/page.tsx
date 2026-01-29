"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./components/Map"), { ssr: false });

interface GeoData {
  city: string;
  country: string;
  countryRegion: string;
  latitude: string;
  longitude: string;
  region: string;
}

export default function Home() {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/geo")
      .then((res) => res.json())
      .then((data) => {
        setGeo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Kamero Geo Location API</h1>
        <p style={styles.subtitle}>Free & Open Source • Powered by Vercel Edge</p>
      </header>

      <main style={styles.main}>
        <div style={styles.mapContainer}>
          {loading ? (
            <div style={styles.loading}>Loading your location...</div>
          ) : geo?.latitude && geo?.longitude ? (
            <Map
              lat={parseFloat(geo.latitude)}
              lng={parseFloat(geo.longitude)}
              city={geo.city || "Unknown"}
              country={geo.country || "Unknown"}
            />
          ) : (
            <div style={styles.loading}>Could not determine location</div>
          )}
        </div>

        <div style={styles.infoCard}>
          <h2 style={styles.cardTitle}>Your Location</h2>
          {loading ? (
            <p>Detecting...</p>
          ) : geo ? (
            <div style={styles.grid}>
              <InfoItem label="City" value={geo.city} />
              <InfoItem label="Country" value={geo.country} />
              <InfoItem label="Region" value={geo.countryRegion} />
              <InfoItem label="Latitude" value={geo.latitude} />
              <InfoItem label="Longitude" value={geo.longitude} />
              <InfoItem label="Edge" value={geo.region} />
            </div>
          ) : (
            <p>Location unavailable</p>
          )}
        </div>

        <div style={styles.apiSection}>
          <h2 style={styles.cardTitle}>API Endpoint</h2>
          <code style={styles.code}>GET /api/geo</code>
          <p style={styles.apiDesc}>
            Returns JSON with city, country, coordinates, and more.
          </p>
          <a
            href="https://github.com/kamero-ai/geo-location-api"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            View on GitHub →
          </a>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© 2026 Kamero AI • MIT License</p>
      </footer>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value || "—"}</span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)",
    color: "#fff",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    textAlign: "center",
    padding: "3rem 1rem 1rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    margin: 0,
    background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#888",
    marginTop: "0.5rem",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  mapContainer: {
    height: "400px",
    borderRadius: "1rem",
    overflow: "hidden",
    background: "#1e1e3f",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#888",
  },
  infoCard: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "1rem",
    padding: "1.5rem",
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1rem",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  label: {
    fontSize: "0.75rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  value: {
    fontSize: "1.1rem",
    fontWeight: 500,
  },
  apiSection: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "1rem",
    padding: "1.5rem",
    textAlign: "center",
  },
  code: {
    display: "inline-block",
    background: "#0d0d1a",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontFamily: "monospace",
    fontSize: "1rem",
    color: "#00d4ff",
    marginBottom: "0.75rem",
  },
  apiDesc: {
    color: "#888",
    marginBottom: "1rem",
  },
  link: {
    color: "#7c3aed",
    textDecoration: "none",
    fontWeight: 500,
  },
  footer: {
    textAlign: "center",
    padding: "2rem",
    color: "#555",
    fontSize: "0.875rem",
  },
};
