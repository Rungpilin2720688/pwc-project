import "server-only";
import type { Review as ReviewRow } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ReviewInput } from "./schema";
import type { Review } from "./types";

export const REVIEWS_PAGE_SIZE = 50;

function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    productId: row.productId,
    author: row.author,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listReviewsForProduct(productId: number, limit = REVIEWS_PAGE_SIZE): Promise<Review[]> {
  const rows = await prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(toReview);
}

export async function createReview(productId: number, input: ReviewInput): Promise<Review | null> {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.$executeRaw`
      UPDATE "Product"
      SET "ratingAvg" = ("ratingAvg" * "reviewCount" + ${input.rating}) / ("reviewCount" + 1),
          "reviewCount" = "reviewCount" + 1,
          "updatedAt" = NOW()
      WHERE "id" = ${productId}
    `;
    if (updated === 0) return null;

    const row = await tx.review.create({ data: { productId, ...input } });
    return toReview(row);
  });
}
