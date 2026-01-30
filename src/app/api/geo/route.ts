import { geolocation, ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const geo = geolocation(request);
  const ip = ipAddress(request);

  // Get additional headers not exposed by @vercel/functions helper
  const continent = request.headers.get("x-vercel-ip-continent") || undefined;
  const timezone = request.headers.get("x-vercel-ip-timezone") || undefined;
  const postalCode = request.headers.get("x-vercel-ip-postal-code") || undefined;

  return NextResponse.json(
    {
      ip,
      city: geo.city,
      country: geo.country,
      countryRegion: geo.countryRegion,
      continent,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone,
      postalCode,
      region: geo.region,
    },
    { headers: corsHeaders }
  );
}
