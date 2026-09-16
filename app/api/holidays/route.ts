import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-side public holidays lookup via Abstract API. */
export async function POST(request: Request) {
  const apiKey = process.env.HOLIDAYS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "Holidays API key is not configured." },
      { status: 501 },
    );
  }

  let body: { country?: string; year?: number; month?: number; day?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const country = body.country?.trim().toUpperCase();
  const year = body.year;
  if (!country || !year) {
    return NextResponse.json({ error: "Missing country or year." }, { status: 400 });
  }

  try {
    const url = new URL("https://holidays.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("country", country);
    url.searchParams.set("year", String(year));
    if (body.month) url.searchParams.set("month", String(body.month));
    if (body.day) url.searchParams.set("day", String(body.day));
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    const holidays = Array.isArray(data)
      ? data.map((h: Record<string, unknown>) => ({
          name: h.name ?? null,
          nameLocal: h.name_local ?? null,
          description: h.description ?? null,
          country: h.country ?? null,
          location: h.location ?? null,
          type: h.type ?? null,
          date: h.date ?? null,
          dateYear: h.date_year ?? null,
          dateMonth: h.date_month ?? null,
          dateDay: h.date_day ?? null,
          weekDay: h.week_day ?? null,
        }))
      : [];

    return NextResponse.json({ holidays });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}