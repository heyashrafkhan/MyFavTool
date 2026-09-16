"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MailCheck,
  MailX,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type EmailCheckResult = {
  email: string | null;
  deliverability: string | null;
  qualityScore: number | null;
  isFormatValid: boolean | null;
  isFreeEmail: boolean | null;
  isDisposable: boolean | null;
  isRoleEmail: boolean | null;
  isCatchall: boolean | null;
  isMxFound: boolean | null;
  isSmtpValid: boolean | null;
  smtpServer: string | null;
};

type Outcome =
  | { status: "ok"; data: EmailCheckResult }
  | { status: "not-configured" }
  | { status: "error" };

export function EmailChecker() {
  const [email, setEmail] = useState("");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
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
  const deliverable = data?.deliverability === "DELIVERABLE";
  const undeliverable = data?.deliverability === "UNDELIVERABLE";

  return (
    <section className="border-b border-ink-100">
      <div className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="pill pill-idle mx-auto">
              <ShieldCheck className="h-3.5 w-3.5" />
              Free · No sign-up · 100 lookups/month
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              Email Checker
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-500">
              Check whether an email address is valid and deliverable — with
              MX records, SMTP status and disposable detection.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
            <form onSubmit={handleCheck} className="p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <span className="sr-only">Email address</span>
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (outcome) setOutcome(null);
                    }}
                    placeholder="e.g. name@example.com"
                    aria-label="Email address"
                    className="h-14 w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-ink-400 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading || email.trim().length === 0}
                  className="btn-primary h-14 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {loading ? "Checking…" : "Check Email"}
                </button>
              </div>
            </form>

            {outcome?.status === "not-configured" && (
              <div className="border-t border-amber-100 bg-amber-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-amber-800">
                  Checker not configured
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Add an Email Validation API key to enable this tool.
                </p>
              </div>
            )}

            {outcome?.status === "error" && (
              <div className="border-t border-red-100 bg-red-50/60 px-6 py-5 sm:px-8">
                <p className="text-sm font-semibold text-red-700">
                  Check failed
                </p>
                <p className="mt-1 text-sm text-ink-600">
                  Could not check that email address. Please try again.
                </p>
              </div>
            )}

            {data && (
              <div
                className={`border-t px-6 py-6 sm:px-8 ${
                  deliverable
                    ? "border-emerald-100 bg-emerald-50/60"
                    : undeliverable
                      ? "border-red-100 bg-red-50/60"
                      : "border-amber-100 bg-amber-50/60"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {deliverable ? (
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                  ) : undeliverable ? (
                    <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-500" />
                  ) : (
                    <MailCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[15px] font-semibold ${
                        deliverable
                          ? "text-emerald-800"
                          : undeliverable
                            ? "text-red-700"
                            : "text-amber-800"
                      }`}
                    >
                      {deliverable
                        ? "Email is deliverable"
                        : undeliverable
                          ? "Email is undeliverable"
                          : "Email status is uncertain"}
                    </p>
                    <p className="mt-1 text-sm text-ink-600">{data.email}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {data.isFormatValid && (
                        <span className="badge bg-white text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          Valid format
                        </span>
                      )}
                      {data.isMxFound && (
                        <span className="badge bg-white text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          MX records found
                        </span>
                      )}
                      {data.isSmtpValid && (
                        <span className="badge bg-white text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          SMTP valid
                        </span>
                      )}
                      {data.isFreeEmail && (
                        <span className="badge bg-white text-ink-600 ring-1 ring-inset ring-ink-200">
                          Free provider
                        </span>
                      )}
                      {data.isDisposable && (
                        <span className="badge bg-white text-red-700 ring-1 ring-inset ring-red-200">
                          Disposable
                        </span>
                      )}
                      {data.isRoleEmail && (
                        <span className="badge bg-white text-amber-700 ring-1 ring-inset ring-amber-200">
                          Role account
                        </span>
                      )}
                      {data.isCatchall && (
                        <span className="badge bg-white text-amber-700 ring-1 ring-inset ring-amber-200">
                          Catch-all
                        </span>
                      )}
                    </div>

                    {data.qualityScore != null && (
                      <p className="mt-3 text-xs text-ink-500">
                        Quality score:{" "}
                        <span className="font-semibold text-ink-900">
                          {data.qualityScore}
                        </span>
                        {data.smtpServer ? ` · SMTP: ${data.smtpServer}` : ""}
                      </p>
                    )}
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