import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { parseProductId } from "@/features/products/query";
import { getProductById } from "@/features/products/repository";
import { ReviewSection } from "@/features/reviews/components/ReviewSection";
import { listReviewsForProduct } from "@/features/reviews/repository";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

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
    <article>
      <ButtonLink href="/products" variant="ghost" className={styles.back}>
        ← Back to products
      </ButtonLink>
      <ProductDetails product={product} />
      <ReviewSection productId={product.id} reviews={reviews} totalCount={product.reviewCount} />
    </article>
  );
}
