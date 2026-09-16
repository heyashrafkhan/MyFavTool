import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Raw response shape from Abstract API Phone Intelligence. */
interface AbstractPhoneIntelligenceResponse {
  phone_number: string;
  phone_format: { international: string; national: string };
  phone_carrier: {
    name: string | null;
    line_type: string | null;
    mcc: number | null;
    mnc: string | null;
  };
  phone_location: {
    country_name: string | null;
    country_code: string | null;
    country_prefix: string | null;
    region: string | null;
    city: string | null;
    timezone: string | null;
  };
  phone_validation: {
    is_valid: boolean;
    line_status: string | null;
    is_voip: boolean | null;
  };
}

/** Normalised shape returned to the client. */
interface LookupResult {
  valid: boolean;
  carrier: string | null;
  lineType: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
}

/**
 * Server-side phone lookup using the Abstract API Phone Intelligence API.
 * Returns carrier + city + line type for a given E.164 number.
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
    const url = new URL("https://phoneintelligence.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("phone", phone);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data: AbstractPhoneIntelligenceResponse = await res.json();

    const result: LookupResult = {
      valid: data.phone_validation?.is_valid ?? false,
      carrier: data.phone_carrier?.name ?? null,
      lineType: data.phone_carrier?.line_type ?? null,
      city: data.phone_location?.city ?? null,
      region: data.phone_location?.region ?? null,
      country: data.phone_location?.country_name ?? null,
      countryCode: data.phone_location?.country_code ?? null,
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}