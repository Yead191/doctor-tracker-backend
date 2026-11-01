"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination } from "@/types";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination || pagination.totalPage <= 1) return null;

  const { page, totalPage, total } = pagination;

  const handlePageSelect = (newPage: number) => {
    if (newPage < 1 || newPage > totalPage || newPage === page) return;

    if (onPageChange) {
      onPageChange(newPage);
      return;
    }

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(newPage));
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPage <= 5) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPage);
      } else if (page >= totalPage - 2) {
        pages.push(1, "...", totalPage - 3, totalPage - 2, totalPage - 1, totalPage);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPage);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200 mt-4">
      <p className="text-sm text-slate-500">
        Showing page <span className="font-semibold text-slate-900">{page}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPage}</span>{" "}
        <span className="text-slate-400">({total} total records)</span>
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => handlePageSelect(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={idx}
                type="button"
                onClick={() => handlePageSelect(p)}
                className={cn(
                  "h-8 w-8 rounded-lg text-xs font-medium transition-colors",
                  p === page
                    ? "bg-teal-600 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 text-xs">
                ...
              </span>
            )
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPage}
          onClick={() => handlePageSelect(page + 1)}
          aria-label="Next Page"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

