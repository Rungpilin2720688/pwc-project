import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ProductSummary } from "../types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try a different category or widen the price range."
        action={<ButtonLink href="/products">Clear all filters</ButtonLink>}
      />
    );
  }

  return (
    <ul className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ul>
  );
}
