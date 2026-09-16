import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-side IP geolocation lookup via Abstract API. */
export async function POST(request: Request) {
  const apiKey = process.env.IP_GEOLOCATION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "IP geolocation API key is not configured." },
      { status: 501 },
    );
  }

  let body: { ip?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ip = body.ip?.trim();
  if (!ip) {
    return NextResponse.json({ error: "Missing IP address." }, { status: 400 });
  }

  try {
    const url = new URL("https://ipgeolocation.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("ip_address", ip);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      ip: data.ip_address ?? null,
      asn: data.asn?.name ?? null,
      city: data.location?.city ?? null,
      region: data.location?.region ?? null,
      country: data.location?.country ?? null,
      countryCode: data.location?.country_code ?? null,
      postalCode: data.location?.postal_code ?? null,
      latitude: data.location?.latitude ?? null,
      longitude: data.location?.longitude ?? null,
      timezone: data.timezone?.name ?? null,
      flag: data.flag?.emoji ?? null,
      currency: data.currency?.code ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}