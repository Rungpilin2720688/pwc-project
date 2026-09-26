import Link from "next/link";
import { RatingStars } from "@/components/RatingStars";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "../types";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <li className="card">
      <Link href={`/products/${product.id}`} className="card__link">
        <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} />
        <div className="card__body">
          <span className="badge">{product.category}</span>
          <h2 className="card__title">{product.name}</h2>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className="card__price">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </li>
  );
}
