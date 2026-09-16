"use client";

import { ArrowRight, LayoutGrid, MessageCircle, ShieldCheck } from "lucide-react";

type HeroProps = {
  toolCount: number;
  categoryCount: number;
};

export function Hero({ toolCount, categoryCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(37,211,102,0.08),transparent_70%)]"
      />
      <div className="container-page relative py-20 text-center sm:py-24">
        <span className="pill pill-idle mx-auto">
          <ShieldCheck className="h-3.5 w-3.5" />
          Free WhatsApp number checker · {toolCount} tool · {categoryCount}{" "}
          category
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
          Check WhatsApp Numbers Instantly
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
          Validate any phone number and confirm whether it is active on
          WhatsApp. Fast, private and completely free — no sign-up required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#checker" className="btn-primary">
            <MessageCircle className="h-4 w-4" />
            Check a Number
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#tools" className="btn-secondary">
            <LayoutGrid className="h-4 w-4" />
            Browse Tools
          </a>
        </div>
      </div>
    </section>
  );
}
