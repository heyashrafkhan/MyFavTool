import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-side company enrichment lookup via Abstract API. */
export async function POST(request: Request) {
  const apiKey = process.env.COMPANY_ENRICHMENT_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "Company enrichment API key is not configured." },
      { status: 501 },
    );
  }

  let body: { domain?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const domain = body.domain?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!domain) {
    return NextResponse.json({ error: "Missing company domain." }, { status: 400 });
  }

  try {
    const url = new URL("https://companyenrichment.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("domain", domain);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      name: data.name ?? null,
      legalName: data.legal_name ?? null,
      domain: data.domain ?? domain,
      description: data.description ?? null,
      employees: data.employees ?? null,
      industry: data.industry ?? null,
      location: data.location ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      founded: data.founded ?? null,
      logo: data.logo ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}