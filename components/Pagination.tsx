"use client";

import Link from "next/link";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({
  totalPages,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  function createPageURL(pageNumber: number) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", pageNumber.toString());

    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Projects pagination"
      className="mt-8 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Previous
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-gray-400 dark:border-gray-800 dark:text-gray-600"
        >
          Previous
        </span>
      )}

      <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          Next
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="cursor-not-allowed rounded-lg border border-gray-200 px-4 py-2 text-gray-400 dark:border-gray-800 dark:text-gray-600"
        >
          Next
        </span>
      )}
    </nav>
  );
}