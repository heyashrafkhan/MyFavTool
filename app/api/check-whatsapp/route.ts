import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side WhatsApp number check.
 *
 * Uses the Abstract API WhatsApp validation endpoint to determine whether a
 * phone number is registered on WhatsApp. The API key is read from the
 * `WHATSAPP_API_KEY` environment variable (never exposed to the client).
 *
 * If no API key is configured, the endpoint returns `registered: null` so the
 * UI can fall back to format-only validation.
 */
export async function POST(request: NextRequest) {
  const { phone } = await request.json();

  if (!phone || typeof phone !== "string") {
    return NextResponse.json(
      { registered: null, error: "Phone number is required." },
      { status: 400 },
    );
  }

  const clean = phone.replace(/[^\d]/g, "");

  if (clean.length < 6 || clean.length > 15) {
    return NextResponse.json({
      registered: null,
      error: "Phone number length is outside valid range.",
    });
  }

  const apiKey = process.env.WHATSAPP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        registered: null,
        error: "WhatsApp lookup is not configured on this deployment.",
        notConfigured: true,
      },
      { status: 501 },
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const url = new URL("https://whatsapp.abstractapi.com/v1/validation");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("phone", clean);

    const res = await fetch(url.toString(), {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      console.error("Abstract API error:", res.status, text);
      return NextResponse.json(
        { registered: null, error: "WhatsApp lookup service error." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      valid?: boolean;
      registered?: boolean;
      is_whatsapp?: boolean;
      whatsapp?: { registered?: boolean };
    };

    // Abstract API returns `valid` for format and `registered` for WhatsApp.
    const registered =
      data.registered ?? data.is_whatsapp ?? data.whatsapp?.registered ?? null;

    return NextResponse.json({ registered });
  } catch (err: unknown) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Request timed out — WhatsApp may be rate-limiting."
        : "Could not reach WhatsApp lookup service.";

    return NextResponse.json(
      { registered: null, error: message },
      { status: 502 },
    );
  }
}
