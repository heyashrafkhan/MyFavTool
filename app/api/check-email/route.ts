import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Server-side email validation via Abstract API. */
export async function POST(request: Request) {
  const apiKey = process.env.EMAIL_VALIDATION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { notConfigured: true, error: "Email validation API key is not configured." },
      { status: 501 },
    );
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email) {
    return NextResponse.json({ error: "Missing email address." }, { status: 400 });
  }

  try {
    const url = new URL("https://emailvalidation.abstractapi.com/v1/");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("email", email);
    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { error: `Lookup failed with status ${res.status}.` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return NextResponse.json({
      email: data.email ?? null,
      deliverability: data.deliverability ?? null,
      qualityScore: data.quality_score ?? null,
      isFormatValid: data.is_valid_format ?? null,
      isFreeEmail: data.is_free_email ?? null,
      isDisposable: data.is_disposable_email ?? null,
      isRoleEmail: data.is_role_email ?? null,
      isCatchall: data.is_catchall_email ?? null,
      isMxFound: data.is_mx_found ?? null,
      isSmtpValid: data.is_smtp_valid ?? null,
      smtpServer: data.smtp_server ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed." }, { status: 502 });
  }
}