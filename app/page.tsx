"use client";

import { Hero } from "@/components/hero-search";
import { WhatsAppChecker } from "@/components/whatsapp-checker";
import { DirectoryBrowser } from "@/components/directory-browser";
import { CategoryCard } from "@/components/category-card";
import { getCategories, tools, totalTools } from "@/lib/tools";

export default function HomePage() {
  const categories = getCategories();

  return (
    <>
      <Hero toolCount={totalTools} categoryCount={categories.length} />

      <WhatsAppChecker />

      <DirectoryBrowser
        tools={tools}
        categories={categories}
        initialQuery=""
      />

      <section id="categories" className="scroll-mt-20 border-t border-ink-100">
        <div className="container-page py-16 sm:py-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
                Browse by Category
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
                Explore tools grouped by what they help you do — from AI and
                coding to writing and everyday utilities.
              </p>
            </div>
            <a
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900 transition-colors hover:text-ink-500"
            >
              View all categories
              <ArrowRightIcon />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}