"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Github, Menu, MessageCircle, Search, Sparkles, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#checker", label: "Checker" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-white">
            <Sparkles className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="text-[17px]">
            MyFav<span className="text-ink-400">Tool</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink-50 text-ink-900"
                    : "text-ink-500 hover:bg-ink-50 hover:text-ink-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/#checker"
            aria-label="WhatsApp Number Checker"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900"
          >
            <MessageCircle className="h-[18px] w-[18px]" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub"
            className="hidden h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-900 sm:grid"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-600 transition-colors hover:bg-ink-50 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
