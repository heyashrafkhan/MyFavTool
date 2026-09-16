import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AbstractPhoneResponse = {
  valid: boolean;
  number: string;
  local_format: string;
  international_format: string;
  country_prefix: string;
  country_code: string;
  country_name: string;
  location: string;
  carrier: string;
  line_type: string;
};

/**
 * Server-side phone lookup using the Abstract API Phone Validation API.
 * Returns carrier + location (city) for a given E.164 number.
 */
export async function POST(request: Request) {
  const apiKey = process.env.PHONE_VALIDATION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "Phone validation API key is not configured." },
      { status: 501 },
    );
  }

  let body: { phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const phone = body.phone?.replace(/\D/g, "");
  if (!phone) {
    return NextResponse.json({ error: "Missing phone number." }, { status: 400 });
  }

  try {
    const url = new URL("https://phonevalidation.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("phone", phone);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data: AbstractPhoneResponse = await res.json();
    return NextResponse.json({
      valid: data.valid,
      carrier: data.carrier || null,
      location: data.location || null,
      lineType: data.line_type || null,
      countryCode: data.country_code || null,
      countryName: data.country_name || null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}