import type { Metadata } from "next";
import { Pagination } from "@/features/products/components/Pagination";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductFilters } from "@/features/products/components/filters/ProductFilters";
import { parseProductQuery, serializeProductQuery } from "@/features/products/query";
import { listCategories, listProducts } from "@/features/products/repository";
import type { RawSearchParams } from "@/lib/search-params";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Products" };

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const query = parseProductQuery(await searchParams);
  const [result, categories] = await Promise.all([listProducts(query), listCategories()]);

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <p className={styles.count}>{result.total.toLocaleString("en-US")} products found</p>
      </header>
      <ProductFilters key={serializeProductQuery(query)} categories={categories} query={query} />
      <ProductGrid products={result.items} />
      <Pagination query={query} totalPages={result.totalPages} />
    </>
  );
}
