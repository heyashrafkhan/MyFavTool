import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { getCategories, getCategoryBySlug, getToolsByCategory } from "@/lib/tools";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  return {
    title: category?.name ?? "Category",
    description: `Browse ${category?.name} tools on MyFavTool.`,
  };
}

export default function CategoryDetailPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  const tools = category ? getToolsByCategory(params.slug) : [];

  if (!category) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-2xl font-semibold text-ink-900">
          Category not found
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          The category you are looking for does not exist.
        </p>
        <Link href="/categories" className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          {category.description}
        </p>
        <p className="mt-2 text-sm text-ink-400">
          {tools.length} {tools.length === 1 ? "tool" : "tools"} in this
          category
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>
    </div>
  );
}
