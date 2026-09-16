"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SearchX, SlidersHorizontal } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import type { Category, SortKey, Tool } from "@/lib/types";

const PAGE_SIZE = 9;

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "trending", label: "Trending" },
  { key: "new", label: "New" },
  { key: "popular", label: "Popular" },
  { key: "featured", label: "Featured" },
];

type DirectoryBrowserProps = {
  tools: Tool[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
};

export function DirectoryBrowser({
  tools,
  categories,
  initialQuery = "",
  initialCategory = "All",
}: DirectoryBrowserProps) {
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortKey>("all");
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);

  // Keep the browser in sync when the hero search pushes a new query.
  useEffect(() => {
    setQuery(initialQuery);
    setPage(1);
  }, [initialQuery]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const result = tools.filter((tool) => {
      const matchesQuery =
        needle.length === 0 ||
        tool.name.toLowerCase().includes(needle) ||
        tool.description.toLowerCase().includes(needle) ||
        tool.category.toLowerCase().includes(needle);

      const matchesCategory =
        category === "All" || tool.category === category;

      const matchesSort =
        sort === "all" ||
        (sort === "trending" && tool.trending) ||
        (sort === "featured" && tool.featured) ||
        sort === "new" ||
        sort === "popular";

      return matchesQuery && matchesCategory && matchesSort;
    });

    const sorted = [...result];
    if (sort === "new") {
      sorted.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
      );
    } else if (sort === "popular") {
      sorted.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === "trending") {
      sorted.sort((a, b) => b.popularity - a.popularity);
    } else if (sort === "featured") {
      sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || b.popularity - a.popularity,
      );
    }

    return sorted;
  }, [tools, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateSort(value: SortKey) {
    setSort(value);
    setPage(1);
  }

  function updateCategory(value: string) {
    setCategory(value);
    setPage(1);
  }

  function goToPage(next: number) {
    setPage(next);
    document
      .getElementById("tools")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <section id="tools" className="scroll-mt-20">
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => updateSort(option.key)}
                className={`pill ${
                  sort === option.key ? "pill-active" : "pill-idle"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-y border-ink-100 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <SlidersHorizontal className="h-4 w-4 shrink-0 text-ink-400" />
              <button
                type="button"
                onClick={() => updateCategory("All")}
                className={`pill shrink-0 ${
                  category === "All" ? "pill-active" : "pill-idle"
                }`}
              >
                All categories
              </button>
              {categories.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => updateCategory(item.name)}
                  className={`pill shrink-0 ${
                    category === item.name ? "pill-active" : "pill-idle"
                  }`}
                >
                  {item.name}
                  <span
                    className={`text-[11px] tabular-nums ${
                      category === item.name ? "text-white/70" : "text-ink-400"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            <p className="shrink-0 text-sm text-ink-500">
              Showing{" "}
              <span className="font-semibold text-ink-900">
                {visible.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-ink-900">
                {filtered.length}
              </span>{" "}
              tools
            </p>
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={start + index} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-20 text-center">
            <SearchX className="h-8 w-8 text-ink-300" />
            <h3 className="mt-4 text-base font-semibold text-ink-900">
              No tools match your filters
            </h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Try a different keyword, or reset the filters to browse the full
              directory.
            </p>
            <button
              type="button"
              onClick={() => {
                updateQuery("");
                updateSort("all");
                updateCategory("All");
              }}
              className="btn-secondary mt-5"
            >
              Reset filters
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-10 flex items-center justify-center gap-1.5"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => goToPage(number)}
                aria-current={number === currentPage ? "page" : undefined}
                className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition-colors ${
                  number === currentPage
                    ? "bg-ink-900 text-white"
                    : "border border-ink-200 text-ink-600 hover:border-ink-300 hover:text-ink-900"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
