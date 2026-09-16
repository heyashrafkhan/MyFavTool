import rawTools from "@/data/tools.json";
import type { Category, Tool } from "./types";

export const tools = rawTools as Tool[];

/** Short blurbs shown on the category browsing cards. */
const categoryBlurbs: Record<string, string> = {
  AI: "Models, agents and local inference runtimes.",
  Coding: "Editors, assistants and code intelligence.",
  Design: "Interface, whiteboard and prototyping tools.",
  "Developer Tools": "APIs, backends and shipping infrastructure.",
  Productivity: "Notes, planning and personal automation.",
  Research: "Search, papers and knowledge synthesis.",
  Utilities: "Small tools that save big amounts of time.",
  Writing: "Drafting, editing and translation helpers.",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategories(): Category[] {
  const counts = new Map<string, number>();
  for (const tool of tools) {
    counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      slug: slugify(name),
      count,
      description: categoryBlurbs[name] ?? "Curated tools for this category.",
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((category) => category.slug === slug);
}

export function getToolsByCategory(slug: string): Tool[] {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return tools.filter((tool) => tool.category === category.name);
}

export function getFeaturedTools(limit = 4): Tool[] {
  return tools
    .filter((tool) => tool.featured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export const totalTools = tools.length;
