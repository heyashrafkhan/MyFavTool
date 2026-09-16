import { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { getCategories } from "@/lib/tools";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all tool categories in the MyFavTool directory.",
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          All Categories
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          Find the right tools for every part of your workflow. Each category
          contains hand-picked, quality tools.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
}
