# Free Geo IP Location API

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api)

**Get user location by IP address for free.** A simple, open-source geolocation API that returns city, country, coordinates, and region data. No API key required.

🌐 **Live Demo:** [https://geo.kamero.ai](https://geo.kamero.ai)

## Features

- ⚡ **Lightning Fast** — Sub-50ms response times via Vercel Edge Network
- 🔓 **No API Key Required** — Start using immediately, no registration
- 🌍 **Global Coverage** — Accurate geolocation for visitors worldwide
- 📖 **Open Source** — MIT licensed, fork and deploy your own instance
- 🆓 **100% Free** — No rate limits, no hidden costs

## How to Get User Location by IP

### Quick Start

Make a GET request to get geolocation data:

```bash
curl https://geo.kamero.ai/api/geo
```

### JavaScript Example

```javascript
// Get user location by IP address
fetch("https://geo.kamero.ai/api/geo")
  .then(res => res.json())
  .then(location => {
    console.log(location.city);    // "San Francisco"
    console.log(location.country); // "US"
  });
```

### Response Format

```json
{
  "ip": "203.0.113.42",
  "city": "San Francisco",
  "country": "US",
  "countryRegion": "CA",
  "continent": "NA",
  "latitude": "37.7749",
  "longitude": "-122.4194",
  "timezone": "America/Los_Angeles",
  "postalCode": "94102",
  "region": "sfo1"
}
```

| Field | Description |
|-------|-------------|
| `ip` | Public IP address of the visitor |
| `city` | City name |
| `country` | ISO 3166-1 alpha-2 country code |
| `countryRegion` | ISO 3166-2 region/state code |
| `continent` | Continent code (AF, AN, AS, EU, NA, OC, SA) |
| `latitude` | Latitude coordinate |
| `longitude` | Longitude coordinate |
| `timezone` | IANA timezone name (e.g., "America/Los_Angeles") |
| `postalCode` | Postal/ZIP code |
| `region` | Vercel Edge Network region |

### Continent Codes

| Code | Continent |
|------|-----------|
| AF | Africa |
| AN | Antarctica |
| AS | Asia |
| EU | Europe |
| NA | North America |
| OC | Oceania |
| SA | South America |

## Use Cases

- **Personalization** — Show localized content based on user location
- **Analytics** — Track visitor geography without third-party services
- **Compliance** — Detect user region for GDPR/privacy compliance
- **Fraud Detection** — Verify user location for security checks
- **Content Delivery** — Route users to nearest servers

## Self-Hosting

### Prerequisites

- [Bun](https://bun.sh/) or Node.js
- [Vercel CLI](https://vercel.com/cli) (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/kamero-ai/geo-location-api.git
cd geo-location-api

# Install dependencies
bun install

# Run locally
bun run dev
```

> **Note:** Geolocation headers only work when deployed to Vercel. Local development returns `undefined` values.

### Deploy to Vercel

```bash
vercel deploy --prod
```

Or use the "Deploy with Vercel" button above.

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Bun](https://bun.sh/) runtime
- [@vercel/functions](https://vercel.com/docs/functions) geolocation helpers
- [Leaflet](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) for maps
- TypeScript

## API Reference

### GET /api/geo

Returns geolocation data for the requesting IP address.

**Request:**
```
GET https://geo.kamero.ai/api/geo
```

**Response:**
```json
{
  "ip": "string | undefined",
  "city": "string | undefined",
  "country": "string | undefined",
  "countryRegion": "string | undefined",
  "continent": "string | undefined",
  "latitude": "string | undefined",
  "longitude": "string | undefined",
  "timezone": "string | undefined",
  "postalCode": "string | undefined",
  "region": "string | undefined"
}
```

**CORS:** Enabled for all origins

## Alternatives Comparison

| Feature | Kamero Geo API | ipapi.co | ipinfo.io |
|---------|---------------|----------|-----------|
| Free Tier | Unlimited | 1,000/day | 50,000/mo |
| API Key Required | No | No | Yes |
| Open Source | Yes | No | No |
| Self-Hostable | Yes | No | No |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License — see [LICENSE](LICENSE) for details.

## Links

- 🌐 **Live API:** [https://geo.kamero.ai](https://geo.kamero.ai)
- 📦 **GitHub:** [https://github.com/kamero-ai/geo-location-api](https://github.com/kamero-ai/geo-location-api)
- 🏢 **Kamero AI:** [https://kamero.ai](https://kamero.ai)

---

**Keywords:** free geo ip api, free geolocation api, ip location api, get user location, ip to location, free ip geolocation, geo ip lookup, ip address location, geolocation by ip, free location api, ip to city, ip to country, vercel geolocation, open source geo api
