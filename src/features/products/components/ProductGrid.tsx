import Link from "next/link";
import type { ProductSummary } from "../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products match these filters.</p>
        <Link href="/products">Clear all filters</Link>
      </div>
    );
  }

  return (
    <ul className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
