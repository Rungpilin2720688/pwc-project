"use client";

import { ButtonLink } from "@/components/ui/Button";
import type { ProductQuery } from "../../query";
import { CategoryFilter } from "./CategoryFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { SortSelect } from "./SortSelect";
import { useProductFilters } from "./useProductFilters";
import styles from "./ProductFilters.module.css";

type Props = {
  categories: string[];
  query: ProductQuery;
};

export function ProductFilters({ categories, query }: Props) {
  const { applyFilters, isPending } = useProductFilters(query);

  return (
    <section className={styles.filters} aria-label="Filter and sort products" aria-busy={isPending}>
      <CategoryFilter
        categories={categories}
        value={query.category}
        onChange={(category) => applyFilters({ category })}
      />
      <SortSelect sort={query.sort} dir={query.dir} onChange={(sort, dir) => applyFilters({ sort, dir })} />
      <PriceRangeFilter minPrice={query.minPrice} maxPrice={query.maxPrice} onApply={applyFilters} />
      <div className={styles.actions}>
        {isPending && <span className={styles.pending}>Updating…</span>}
        <ButtonLink href="/products" variant="ghost">
          Reset
        </ButtonLink>
      </div>
    </section>
  );
}
