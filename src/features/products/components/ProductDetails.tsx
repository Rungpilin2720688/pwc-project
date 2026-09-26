import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatPrice } from "@/lib/format";
import type { ProductDetail } from "../types";
import { ProductImage } from "./ProductImage";
import styles from "./ProductDetails.module.css";

export function ProductDetails({ product }: { product: ProductDetail }) {
  return (
    <section className={styles.details}>
      <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} size="hero" />
      <div className={styles.info}>
        <Badge>{product.category}</Badge>
        <h1 className={styles.name}>{product.name}</h1>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <p className={styles.price}>{formatPrice(product.price)}</p>
        <div className={styles.divider} />
        <h2 className={styles.descriptionHeading}>Description</h2>
        <p className={styles.description}>{product.description}</p>
      </div>
    </section>
  );
}
