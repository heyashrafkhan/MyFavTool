import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-side currency conversion via Abstract API Exchange Rates. */
export async function POST(request: Request) {
  const apiKey = process.env.EXCHANGE_RATES_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "Exchange rates API key is not configured." },
      { status: 501 },
    );
  }

  let body: { base?: string; target?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const base = body.base?.trim().toUpperCase();
  const target = body.target?.trim().toUpperCase();
  if (!base || !target) {
    return NextResponse.json({ error: "Missing base or target currency." }, { status: 400 });
  }

  try {
    const url = new URL("https://exchange-rates.abstractapi.com/v1/live/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("base", base);
    url.searchParams.set("target", target);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const rate =
      data.target_rate ??
      data.exchange_rate ??
      data.rates?.[target] ??
      null;

    return NextResponse.json({
      base: data.base ?? base,
      target,
      rate,
      date: data.date ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}