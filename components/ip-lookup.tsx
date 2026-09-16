"use client";

import { useState } from "react";
import {
  Building2,
  Clock,
  Coins,
  Globe,
  Loader2,
  MapPin,
  Network,
  Search,
  ShieldCheck,
} from "lucide-react";

type IpLookupResult = {
  ip: string | null;
  asn: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  flag: string | null;
  currency: string | null;
};

type Outcome =
  | { status: "ok"; data: IpLookupResult }
  | { status: "not-configured" }
  | { status: "error" };

export function IpLookup() {
  const [ip, setIp] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/lookup-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ip.trim() }),
      });
      if (res.status === 501) setOutcome({ status: "not-configured" });
      else if (!res.ok) setOutcome({ status: "error" });
      else setOutcome({ status: "ok", data: await res.json() });
    } catch {
      setOutcome({ status: "error" });
    }
    setLoading(false);
  }

  const data = outcome?.status === "ok" ? outcome.data : null;

  return (
    <section className="border-b border-ink-100">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="pill pill-idle mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free · No sign-up · 1,000 lookups/month
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              IP Address Lookup
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Enter any IP address to see its city, region, country, ISP and
              timezone.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleLookup} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">IP address</span>
                  <Network className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={ip}
                    onChange={(event) => {
                      setIp(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    placeholder="e.g. 8.8.8.8"
                    aria-label="IP address"
                    className="h-14 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || ip.trim().length === 0}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {loading ? "Looking up…" : "Lookup IP"}
                </button>
              </div>
            </form>

            {outcome?.status === "not-configured" && (
              <div className="border-t border-amber-100 bg-amber-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-amber-800">
                  Lookup not configured
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add an IP Geolocation API key to enable this tool.
                </p>
              </div>
            )}

            {outcome?.status === "error" && (
              <div className="border-t border-red-100 bg-red-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-red-700">
                  Lookup failed
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Could not look up that IP address. Please check it and try
                  again.
                </p>
              </div>
            )}

            {data && (
              <div className="border-t border-emerald-100 bg-emerald-50/60 px-6 py-6 sm:px-8">
                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-emerald-800">
                      {data.flag ? `${data.flag} ` : ""}
                      {data.city ?? "Unknown location"}
                      {data.region ? `, ${data.region}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-ink-600">
                      {data.country ?? "Unknown country"}
                      {data.countryCode ? ` (${data.countryCode})` : ""}
                      {data.postalCode ? ` · ${data.postalCode}` : ""}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                        <Network className="h-4 w-4 shrink-0 text-ink-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                            IP address
                          </p>
                          <p className="truncate text-sm font-semibold tabular-nums text-ink-900">
                            {data.ip}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                        <Building2 className="h-4 w-4 shrink-0 text-ink-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                            ISP / ASN
                          </p>
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {data.asn ?? "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                        <Clock className="h-4 w-4 shrink-0 text-ink-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                            Timezone
                          </p>
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {data.timezone ?? "—"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                        <Coins className="h-4 w-4 shrink-0 text-ink-400" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                            Currency
                          </p>
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {data.currency ?? "—"}
                          </p>
                        </div>
                      </div>
                      {data.latitude != null && data.longitude != null && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3 sm:col-span-2">
                          <Globe className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Coordinates
                            </p>
                            <p className="truncate text-sm font-semibold tabular-nums text-ink-900">
                              {data.latitude}, {data.longitude}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}