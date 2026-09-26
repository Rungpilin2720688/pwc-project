import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "../types";
import { ProductImage } from "./ProductImage";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li className={styles.card}>
      <Link href={`/products/${product.id}`} className={styles.link}>
        <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} />
        <div className={styles.body}>
          <Badge>{product.category}</Badge>
          <h2 className={styles.title}>{product.name}</h2>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className={styles.price}>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </li>
  );
}
