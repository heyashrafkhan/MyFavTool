"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  Coins,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "INR", name: "Indian Rupee" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "ZAR", name: "South African Rand" },
  { code: "EGP", name: "Egyptian Pound" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "THB", name: "Thai Baht" },
  { code: "VND", name: "Vietnamese Dong" },
  { code: "KRW", name: "South Korean Won" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "LKR", name: "Sri Lankan Rupee" },
];

type ConvertResult = {
  base: string;
  target: string;
  rate: number | null;
  date: string | null;
};

type Outcome =
  | { status: "ok"; data: ConvertResult }
  | { status: "not-configured" }
  | { status: "error" };

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleConvert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/convert-currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base: from, target: to }),
      });
      if (res.status === 501) setOutcome({ status: "not-configured" });
      else if (!res.ok) setOutcome({ status: "error" });
      else setOutcome({ status: "ok", data: await res.json() });
    } catch {
      setOutcome({ status: "error" });
    }
    setLoading(false);
  }

  function swap() {
    setFrom(to);
    setTo(from);
    if (outcome) setOutcome(null);
  }

  const data = outcome?.status === "ok" ? outcome.data : null;
  const parsedAmount = parseFloat(amount) || 0;
  const converted =
    data?.rate != null ? (parsedAmount * data.rate).toFixed(2) : null;

  return (
    <section className="border-b border-ink-100">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="pill pill-idle mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free · No sign-up · Live rates
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Currency Converter
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Convert between 30+ world currencies with live exchange rates.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleConvert} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="relative flex-1">
                  <span className="sr-only">Amount</span>
                  <Coins className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    placeholder="1.00"
                    aria-label="Amount"
                    className="h-14 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none"
                  />
                </label>

                <label className="relative flex-1">
                  <span className="sr-only">From currency</span>
                  <select
                    value={from}
                    onChange={(event) => {
                      setFrom(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    className="h-14 w-full appearance-none rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-900 focus:border-ink-400 focus:outline-none"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={swap}
                  aria-label="Swap currencies"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-ink-200 bg-ink-50 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>

                <label className="relative flex-1">
                  <span className="sr-only">To currency</span>
                  <select
                    value={to}
                    onChange={(event) => {
                      setTo(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    className="h-14 w-full appearance-none rounded-xl border border-ink-200 bg-white px-4 text-sm font-medium text-ink-900 focus:border-ink-400 focus:outline-none"
                  >
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={loading || parsedAmount <= 0}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {loading ? "Converting…" : "Convert"}
                </button>
              </div>
            </form>

            {outcome?.status === "not-configured" && (
              <div className="border-t border-amber-100 bg-amber-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-amber-800">
                  Converter not configured
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add an Exchange Rates API key to enable this tool.
                </p>
              </div>
            )}

            {outcome?.status === "error" && (
              <div className="border-t border-red-100 bg-red-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-red-700">
                  Conversion failed
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Could not fetch the exchange rate. Please try again.
                </p>
              </div>
            )}

            {data && converted != null && (
              <div className="border-t border-emerald-100 bg-emerald-50/60 px-6 py-6 sm:px-8">
                <p className="text-[15px] font-semibold text-emerald-800">
                  {parsedAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {data.base} =
                </p>
                <p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-ink-900">
                  {converted} {data.target}
                </p>
                <p className="mt-2 text-xs text-ink-500">
                  1 {data.base} = {data.rate} {data.target}
                  {data.date ? ` · Rate date: ${data.date}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}