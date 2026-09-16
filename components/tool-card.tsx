import { ExternalLink } from "lucide-react";
import type { Tool } from "@/lib/types";

type ToolCardProps = {
  tool: Tool;
  index: number;
};

export function ToolCard({ tool, index }: ToolCardProps) {
  const isInternal = tool.url.startsWith("/");

  return (
    <a
      href={tool.url}
      {...(isInternal ? {} : { target: "_blank", rel: "noreferrer noopener" })}
      className="group relative flex flex-col rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2"
    >
      <div className="flex items-start gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tool.logo}
            alt={`${tool.name} logo`}
            width={48}
            height={48}
            loading="lazy"
            className="h-7 w-7 object-contain"
          />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tabular-nums text-ink-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="truncate text-[15px] font-semibold text-ink-900">
              {tool.name}
            </h3>
          </div>
          <span className="badge mt-1.5 bg-ink-100 text-ink-600">
            {tool.category}
          </span>
        </div>

        {tool.featured && (
          <span className="badge shrink-0 bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200">
            Featured
          </span>
        )}
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-500">
        {tool.description}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3.5">
        <span className="text-xs font-medium text-ink-400">
          {tool.trending ? "Trending now" : `Added ${tool.dateAdded}`}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500 transition-colors group-hover:text-ink-900">
          Visit
          <ExternalLink className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </a>
  );
}
