import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { RatingStars } from "@/components/RatingStars";
import { ProductImage } from "@/features/products/components/ProductImage";
import { parseProductId } from "@/features/products/query";
import { getProductById } from "@/features/products/repository";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { listReviewsForProduct } from "@/features/reviews/repository";
import { formatPrice } from "@/lib/format";

// Reviews change at runtime, so always render on request (also avoids DB access at build time).
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

// Deduplicates the lookup between generateMetadata and the page within one request.
const loadProduct = cache(async (rawId: string) => {
  const id = parseProductId(rawId);
  return id === null ? null : getProductById(id);
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await loadProduct((await params).id);
  return { title: product?.name ?? "Product not found" };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await loadProduct((await params).id);
  if (!product) notFound();

  const reviews = await listReviewsForProduct(product.id);

  return (
    <article className="detail">
      <Link href="/products" className="back-link">
        ← Back to products
      </Link>

      <div className="detail__top">
        <ProductImage name={product.name} category={product.category} imageUrl={product.imageUrl} size="hero" />
        <div className="detail__info">
          <span className="badge">{product.category}</span>
          <h1>{product.name}</h1>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className="detail__price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
        </div>
      </div>

      <section className="reviews" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading">Reviews ({product.reviewCount})</h2>
        <div className="reviews__layout">
          <div>
            <ReviewList reviews={reviews} totalCount={product.reviewCount} />
          </div>
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </article>
  );
}
