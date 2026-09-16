"use client";

import { useState } from "react";
import {
  Building2,
  Calendar,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

type CompanyResult = {
  name: string | null;
  legalName: string | null;
  domain: string | null;
  description: string | null;
  employees: number | null;
  industry: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  founded: number | null;
  logo: string | null;
};

type Outcome =
  | { status: "ok"; data: CompanyResult }
  | { status: "not-configured" }
  | { status: "error" };

export function CompanyLookup() {
  const [domain, setDomain] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/lookup-company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domain.trim() }),
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
              Free · No sign-up · Company data
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Company Lookup
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Enter a company domain to see its name, industry, size, location
              and more.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleLookup} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Company domain</span>
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="text"
                    value={domain}
                    onChange={(event) => {
                      setDomain(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    placeholder="e.g. google.com"
                    aria-label="Company domain"
                    className="h-14 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || domain.trim().length === 0}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {loading ? "Looking up…" : "Lookup Company"}
                </button>
              </div>
            </form>

            {outcome?.status === "not-configured" && (
              <div className="border-t border-amber-100 bg-amber-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-amber-800">
                  Lookup not configured
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add a Company Enrichment API key to enable this tool.
                </p>
              </div>
            )}

            {outcome?.status === "error" && (
              <div className="border-t border-red-100 bg-red-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-red-700">
                  Lookup failed
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Could not find that company. Please check the domain and try
                  again.
                </p>
              </div>
            )}

            {data && (
              <div className="border-t border-emerald-100 bg-emerald-50/60 px-6 py-6 sm:px-8">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink-100 bg-white">
                    {data.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.logo}
                        alt={`${data.name ?? "Company"} logo`}
                        width={48}
                        height={48}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <Building2 className="h-5 w-5 text-ink-400" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-emerald-800">
                      {data.name ?? data.domain}
                    </p>
                    {data.legalName && data.legalName !== data.name && (
                      <p className="mt-0.5 text-sm text-ink-500">
                        {data.legalName}
                      </p>
                    )}
                    {data.description && (
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">
                        {data.description}
                      </p>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {data.industry && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <Building2 className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Industry
                            </p>
                            <p className="truncate text-sm font-semibold text-ink-900">
                              {data.industry}
                            </p>
                          </div>
                        </div>
                      )}
                      {data.employees != null && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <Users className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Employees
                            </p>
                            <p className="truncate text-sm font-semibold tabular-nums text-ink-900">
                              {data.employees.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {data.location && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <MapPin className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Location
                            </p>
                            <p className="truncate text-sm font-semibold text-ink-900">
                              {data.location}
                            </p>
                          </div>
                        </div>
                      )}
                      {data.founded != null && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <Calendar className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Founded
                            </p>
                            <p className="truncate text-sm font-semibold tabular-nums text-ink-900">
                              {data.founded}
                            </p>
                          </div>
                        </div>
                      )}
                      {data.phone && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <Phone className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Phone
                            </p>
                            <p className="truncate text-sm font-semibold tabular-nums text-ink-900">
                              {data.phone}
                            </p>
                          </div>
                        </div>
                      )}
                      {data.email && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-ink-100 bg-white px-3.5 py-3">
                          <Mail className="h-4 w-4 shrink-0 text-ink-400" />
                          <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                              Email
                            </p>
                            <p className="truncate text-sm font-semibold text-ink-900">
                              {data.email}
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