"use client";

import { ArrowRight, LayoutGrid, ShieldCheck, Sparkles } from "lucide-react";

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
          Free tools · {toolCount} tools · {categoryCount} category
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
          Free Online Tools, Right in Your Browser
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
          Check WhatsApp numbers, look up IP addresses, verify emails, convert
          currency and more. Fast, private and completely free — no sign-up
          required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#tools" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            Explore Tools
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#categories" className="btn-secondary">
            <LayoutGrid className="h-4 w-4" />
            Browse Categories
          </a>
        </div>
      </div>
    </section>
  );
}
