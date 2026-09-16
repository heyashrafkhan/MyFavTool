import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-ink-900">
          {category.name}
        </h3>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink-900" />
      </div>
      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
        {category.description}
      </p>
      <span className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
        {category.count} {category.count === 1 ? "tool" : "tools"}
      </span>
    </Link>
  );
}
