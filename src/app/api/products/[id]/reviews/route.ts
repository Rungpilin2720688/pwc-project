import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { parseProductId } from "@/features/products/query";
import { getProductById } from "@/features/products/repository";
import { createReview, listReviewsForProduct } from "@/features/reviews/repository";
import { reviewInputSchema } from "@/features/reviews/schema";
import { jsonError } from "@/lib/http";

type Context = { params: Promise<{ id: string }> };

const productNotFound = () => jsonError(404, "Product not found");

export async function GET(_request: Request, { params }: Context) {
  const productId = parseProductId((await params).id);
  if (productId === null || !(await getProductById(productId))) return productNotFound();

  const reviews = await listReviewsForProduct(productId);
  return NextResponse.json({ items: reviews });
}

export async function POST(request: Request, { params }: Context) {
  const productId = parseProductId((await params).id);
  if (productId === null) return productNotFound();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "Request body must be valid JSON");
  }

  const parsed = reviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please fix the highlighted fields", parsed.error.flatten().fieldErrors);
  }

  const review = await createReview(productId, parsed.data);
  if (!review) return productNotFound();

  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");

  return NextResponse.json(review, { status: 201 });
}
