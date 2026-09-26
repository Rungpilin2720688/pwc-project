"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { productsHref, type ProductQuery, type SortDirection, type SortField } from "../query";

const SORT_OPTIONS: { value: `${SortField}-${SortDirection}`; label: string }[] = [
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "rating-desc", label: "Rating: high → low" },
  { value: "rating-asc", label: "Rating: low → high" },
];

type Props = {
  categories: string[];
  query: ProductQuery;
};

export function ProductFilters({ categories, query }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [minPrice, setMinPrice] = useState(query.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(query.maxPrice?.toString() ?? "");
  const [priceError, setPriceError] = useState<string | null>(null);

  function navigate(changes: Partial<ProductQuery>) {
    startTransition(() => router.push(productsHref({ ...query, ...changes, page: 1 })));
  }

  function handlePriceSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = minPrice === "" ? undefined : Number(minPrice);
    const max = maxPrice === "" ? undefined : Number(maxPrice);

    if ((min !== undefined && (Number.isNaN(min) || min < 0)) || (max !== undefined && (Number.isNaN(max) || max < 0))) {
      setPriceError("Prices must be positive numbers.");
      return;
    }
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError("Min price cannot be greater than max price.");
      return;
    }
    setPriceError(null);
    navigate({ minPrice: min, maxPrice: max });
  }

  return (
    <section className="filters" aria-label="Filter and sort products" aria-busy={isPending}>
      <label className="field">
        <span>Category</span>
        <select
          value={query.category ?? ""}
          onChange={(event) => navigate({ category: event.target.value || undefined })}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Sort by</span>
        <select
          value={`${query.sort}-${query.dir}`}
          onChange={(event) => {
            const [sort, dir] = event.target.value.split("-") as [SortField, SortDirection];
            navigate({ sort, dir });
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <form className="price-form" onSubmit={handlePriceSubmit} noValidate>
        <label className="field">
          <span>Min price</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            aria-invalid={priceError ? true : undefined}
            aria-describedby={priceError ? "price-error" : undefined}
          />
        </label>
        <label className="field">
          <span>Max price</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Any"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            aria-invalid={priceError ? true : undefined}
            aria-describedby={priceError ? "price-error" : undefined}
          />
        </label>
        <button type="submit" className="button">
          Apply
        </button>
        {priceError && (
          <p id="price-error" className="field-error" role="alert">
            {priceError}
          </p>
        )}
      </form>

      <Link href="/products" className="reset-link">
        Reset
      </Link>
      {isPending && <span className="muted">Updating…</span>}
    </section>
  );
}
