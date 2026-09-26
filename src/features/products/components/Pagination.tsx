import Link from "next/link";
import { productsHref, type ProductQuery } from "../query";

type Props = {
  query: ProductQuery;
  totalPages: number;
};

export function Pagination({ query, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const { page } = query;
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      {hasPrev ? (
        <Link href={productsHref({ ...query, page: page - 1 })} rel="prev">
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true">← Previous</span>
      )}
      <span>
        Page {page.toLocaleString("en-US")} of {totalPages.toLocaleString("en-US")}
      </span>
      {hasNext ? (
        <Link href={productsHref({ ...query, page: page + 1 })} rel="next">
          Next →
        </Link>
      ) : (
        <span aria-disabled="true">Next →</span>
      )}
    </nav>
  );
}
