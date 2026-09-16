export type Tool = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  logo: string;
  url: string;
  featured: boolean;
  dateAdded: string;
  popularity: number;
  trending: boolean;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  description: string;
};

export type SortKey = "all" | "trending" | "new" | "popular" | "featured";
