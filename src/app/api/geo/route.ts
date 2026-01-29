import { geolocation } from "@vercel/functions";
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

  return NextResponse.json(
    {
      city: geo.city,
      country: geo.country,
      countryRegion: geo.countryRegion,
      latitude: geo.latitude,
      longitude: geo.longitude,
      region: geo.region,
    },
    { headers: corsHeaders }
  );
}
