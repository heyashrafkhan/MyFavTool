import Link from "next/link";
import { Sparkles } from "lucide-react";
import { getCategories, totalTools } from "@/lib/tools";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function SiteFooter() {
  const categories = getCategories().slice(0, 5);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-100 bg-ink-50/60">
      <div className="container-page py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-900 text-white">
                <Sparkles className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-[17px]">
                MyFav<span className="text-ink-400">Tool</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              Free WhatsApp number checker that validates phone numbers and
              opens them in WhatsApp. Fast, private and no sign-up required.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-600 transition-colors hover:text-ink-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Top Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-sm text-ink-600 transition-colors hover:text-ink-900"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/#checker"
                  className="text-sm text-ink-600 transition-colors hover:text-ink-900"
                >
                  WhatsApp Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-ink-600 transition-colors hover:text-ink-900"
                >
                  How it works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-ink-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-500">
            © {year} MyFavTool. All rights reserved.
          </p>
          <p className="text-sm text-ink-400">
            Built with Next.js &amp; Tailwind CSS · Developed by{" "}
            <span className="font-medium text-ink-600">Ashraf Khan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
