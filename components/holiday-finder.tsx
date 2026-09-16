"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Globe,
  Loader2,
  PartyPopper,
  Search,
  ShieldCheck,
} from "lucide-react";

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
];

type Holiday = {
  name: string | null;
  nameLocal: string | null;
  description: string | null;
  country: string | null;
  location: string | null;
  type: string | null;
  date: string | null;
  dateYear: string | null;
  dateMonth: string | null;
  dateDay: string | null;
  weekDay: string | null;
};

type Outcome =
  | { status: "ok"; holidays: Holiday[] }
  | { status: "not-configured" }
  | { status: "error" };

export function HolidayFinder() {
  const currentYear = new Date().getFullYear();
  const [country, setCountry] = useState("US");
  const [year, setYear] = useState(currentYear);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, year }),
      });
      if (res.status === 501) setOutcome({ status: "not-configured" });
      else if (!res.ok) setOutcome({ status: "error" });
      else {
        const data = await res.json();
        setOutcome({ status: "ok", holidays: data.holidays ?? [] });
      }
    } catch {
      setOutcome({ status: "error" });
    }
    setLoading(false);
  }

  const selected = countries.find((c) => c.code === country);

  return (
    <section className="border-b border-ink-100">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="pill pill-idle mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free · No sign-up · 65+ countries
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Public Holidays
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Find public holidays for any country and year.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleSearch} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Country</span>
                  <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <select
                    value={country}
                    onChange={(event) => {
                      setCountry(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    className="h-14 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-10 pr-9 text-sm font-medium text-ink-900 focus:border-ink-400 focus:outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </label>

                <label className="relative flex-1">
                  <span className="sr-only">Year</span>
                  <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <select
                    value={year}
                    onChange={(event) => {
                      setYear(Number(event.target.value));
                      if (outcome) setOutcome(null);
                    }}
                    className="h-14 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-10 pr-9 text-sm font-medium text-ink-900 focus:border-ink-400 focus:outline-none"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {loading ? "Loading…" : "Get Holidays"}
                </button>
              </div>
            </form>

            {outcome?.status === "not-configured" && (
              <div className="border-t border-amber-100 bg-amber-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-amber-800">
                  Holidays not configured
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add a Public Holidays API key to enable this tool.
                </p>
              </div>
            )}

            {outcome?.status === "error" && (
              <div className="border-t border-red-100 bg-red-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-red-700">
                  Search failed
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Could not fetch holidays. Please try again.
                </p>
              </div>
            )}

            {outcome?.status === "ok" && (
              <div className="border-t border-emerald-100 bg-emerald-50/60 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-2">
                  <PartyPopper className="h-5 w-5 text-emerald-600" />
                  <p className="text-[15px] font-semibold text-emerald-800">
                    {selected?.flag} {selected?.name} — {year}
                  </p>
                </div>
                <p className="mt-1 text-sm text-ink-600">
                  {outcome.holidays.length} public holiday
                  {outcome.holidays.length === 1 ? "" : "s"} found.
                </p>

                {outcome.holidays.length > 0 ? (
                  <ul className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-100 bg-white">
                    {outcome.holidays.map((holiday, index) => (
                      <li
                        key={`${holiday.date}-${index}`}
                        className="flex items-start gap-3 px-4 py-3"
                      >
                        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-[11px] font-bold leading-tight text-emerald-700">
                          {holiday.dateMonth}/{holiday.dateDay}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink-900">
                            {holiday.name}
                          </p>
                          <p className="mt-0.5 text-xs text-ink-500">
                            {holiday.weekDay}
                            {holiday.type ? ` · ${holiday.type}` : ""}
                            {holiday.description
                              ? ` · ${holiday.description}`
                              : ""}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-ink-500">
                    No holidays found for this selection.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}