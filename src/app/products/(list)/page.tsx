import type { Metadata } from "next";
import { Pagination } from "@/features/products/components/Pagination";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { parseProductQuery, serializeProductQuery } from "@/features/products/query";
import { listCategories, listProducts } from "@/features/products/repository";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = { title: "Products" };

type Props = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const query = parseProductQuery(await searchParams);
  const [result, categories] = await Promise.all([listProducts(query), listCategories()]);

  return (
    <>
      <div className="page-header">
        <h1>Products</h1>
        <p className="muted">{result.total.toLocaleString("en-US")} products found</p>
      </div>
      <ProductFilters key={serializeProductQuery(query)} categories={categories} query={query} />
      <ProductGrid products={result.items} />
      <Pagination query={query} totalPages={result.totalPages} />
    </>
  );
}
