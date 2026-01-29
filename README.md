# Geo API

A simple, open-source API that returns visitor geolocation data using [Vercel's Geo-IP headers](https://vercel.com/docs/edge-network/headers#x-vercel-ip-city).

## Live Demo

Deploy your own instance and hit `/api/geo` to get your location data.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kamero-ai/geo-location-api-)

## API Response

```json
{
  "city": "San Francisco",
  "country": "US",
  "countryRegion": "CA",
  "latitude": "37.7749",
  "longitude": "-122.4194",
  "region": "sfo1"
}
```

| Field | Description |
|-------|-------------|
| `city` | The city name |
| `country` | ISO 3166-1 alpha-2 country code |
| `countryRegion` | ISO 3166-2 region code |
| `latitude` | Latitude coordinate |
| `longitude` | Longitude coordinate |
| `region` | Vercel Edge Network region that served the request |

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Bun](https://bun.sh/) runtime
- [@vercel/functions](https://vercel.com/docs/functions) for geolocation helpers
- TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Vercel CLI](https://vercel.com/cli) (optional, for deployment)

### Installation

```bash
# Clone the repo
git clone https://github.com/kamero-ai/geo-location-api-.git
cd geo-api

# Install dependencies
bun install

# Run locally
bun run dev
```

### Local Development

> **Note:** Geolocation headers are only available when deployed to Vercel. Locally, all values will return `undefined`.

### Deploy to Vercel

```bash
vercel deploy
```

Or click the "Deploy with Vercel" button above.

## Usage

Once deployed, make a GET request to your deployment:

```bash
curl https://your-app.vercel.app/api/geo
```

### CORS

The API is public and accessible from any origin.

## License

MIT
