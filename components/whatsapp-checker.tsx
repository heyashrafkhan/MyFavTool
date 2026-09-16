"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  countries,
  lookupPhone,
  validateNumber,
  waLink,
  type CheckResult,
  type PhoneLookupOutcome,
} from "@/lib/phone";

export function WhatsAppChecker() {
  const [countryCode, setCountryCode] = useState("US");
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [lookup, setLookup] = useState<PhoneLookupOutcome | null>(null);
  const [checking, setChecking] = useState(false);

  const country = useMemo(
    () => countries.find((c) => c.code === countryCode) ?? countries[0],
    [countryCode],
  );

  async function handleCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecking(true);
    setLookup(null);
    // Validate the number format against the selected country's rules.
    const res = validateNumber(number, country);
    setResult(res);
    // If the format is valid, look up the carrier and city server-side.
    if (res.valid) {
      setLookup(await lookupPhone(res.e164));
    }
    setChecking(false);
  }

  function handleNumberChange(value: string) {
    const cleaned = value.replace(/[^\d\s\-()+]/g, "");
    setNumber(cleaned);
    if (result) setResult(null);
    if (lookup) setLookup(null);
  }

  return (
    <section id="checker" className="scroll-mt-20 border-b border-ink-100">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="pill pill-idle mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free · No sign-up · 100% private
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Check a WhatsApp Number
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Enter a phone number to see its operator and city, then open it
              in WhatsApp. If the chat opens, the number is available — if
              not, it isn&apos;t.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleCheck} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1 sm:max-w-[220px]">
                  <span className="sr-only">Country</span>
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <select
                    value={countryCode}
                    onChange={(event) => {
                      setCountryCode(event.target.value);
                      if (result) setResult(null);
                    }}
                    className="h-14 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-10 pr-9 text-sm font-medium text-ink-900 focus:border-ink-400 focus:outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </label>

                <label className="relative flex-1">
                  <span className="sr-only">Phone number</span>
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-ink-400">
                    {country.dial}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={number}
                    onChange={(event) => handleNumberChange(event.target.value)}
                    placeholder="e.g. 555 123 4567"
                    aria-label="Phone number"
                    className="h-14 w-full rounded-xl border border-ink-200 bg-white pl-16 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={checking || number.replace(/\D/g, "").length === 0}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {checking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4" />
                  )}
                  {checking ? "Checking…" : "Check Number"}
                </button>
              </div>
            </form>

            {result && (
              <div
                className={`border-t px-6 py-6 sm:px-8 ${
                  result.valid
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-red-100 bg-red-50/60"
                }`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3.5">
                    {result.valid ? (
                      <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                    )}
                    <div>
                      {result.valid ? (
                        <>
                          <p className="text-[15px] font-semibold text-emerald-800">
                            Number format looks correct
                          </p>
                          <p className="mt-1 text-sm text-ink-600">
                            {result.message}
                          </p>
                          {checking && lookup === null ? (
                            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-ink-500">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Looking up carrier &amp; city…
                            </p>
                          ) : lookup?.status === "ok" &&
                            (lookup.data.carrier || lookup.data.location) ? (
                            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
                              {lookup.data.carrier && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Building2 className="h-3.5 w-3.5 text-ink-400" />
                                  <span className="font-medium text-ink-900">
                                    {lookup.data.carrier}
                                  </span>
                                </span>
                              )}
                              {lookup.data.location && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                                  <span className="font-medium text-ink-900">
                                    {lookup.data.location}
                                  </span>
                                </span>
                              )}
                            </div>
                          ) : null}
                          <p className="mt-1.5 text-xs text-ink-500">
                            Tap <strong>Open in WhatsApp</strong> below. If the
                            chat opens, the number is available on WhatsApp —
                            if it doesn&apos;t, it isn&apos;t.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[15px] font-semibold text-red-700">
                            Number format is invalid
                          </p>
                          <p className="mt-1 text-sm text-ink-600">
                            {result.message}
                          </p>
                        </>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-ink-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-ink-400" />
                          <span className="font-semibold tabular-nums text-ink-900">
                            {result.e164}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-ink-400" />
                          {result.country.flag} {result.country.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {result.valid && (
                    <a
                      href={waLink(result.e164)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-primary shrink-0"
                    >
                      Open in WhatsApp
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Operator & city",
                text: "Shows the mobile operator and city for the number, when available.",
              },
              {
                title: "Open in WhatsApp",
                text: "Opens the number in WhatsApp — if the chat loads, the number is available.",
              },
              {
                title: "Free & private",
                text: "No sign-up needed. Numbers are only used for the lookup, never stored.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-ink-200 bg-white p-5 shadow-card"
              >
                <h3 className="text-sm font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}