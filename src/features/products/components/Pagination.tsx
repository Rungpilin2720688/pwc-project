import { ButtonLink } from "@/components/ui/Button";
import { productsHref, type ProductQuery } from "../query";
import styles from "./Pagination.module.css";

type Props = {
  query: ProductQuery;
  totalPages: number;
};

export function Pagination({ query, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const { page } = query;

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      {page > 1 ? (
        <ButtonLink href={productsHref({ ...query, page: page - 1 })} rel="prev">
          ← Previous
        </ButtonLink>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          ← Previous
        </span>
      )}
      <span className={styles.status}>
        Page <strong>{page.toLocaleString("en-US")}</strong> of {totalPages.toLocaleString("en-US")}
      </span>
      {page < totalPages ? (
        <ButtonLink href={productsHref({ ...query, page: page + 1 })} rel="next">
          Next →
        </ButtonLink>
      ) : (
        <span className={styles.disabled} aria-disabled="true">
          Next →
        </span>
      )}
    </nav>
  );
}
