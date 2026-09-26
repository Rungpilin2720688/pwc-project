import type { ApiErrorBody } from "@/lib/http";
import { toReviewFieldErrors, type ReviewFieldErrors, type ReviewInput } from "./schema";
import type { Review } from "./types";

export type SubmitReviewResult =
  | { ok: true; review: Review }
  | { ok: false; message: string; fieldErrors: ReviewFieldErrors };

export async function submitReview(productId: number, input: ReviewInput): Promise<SubmitReviewResult> {
  let response: Response;
  try {
    response = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again.", fieldErrors: {} };
  }

  if (response.ok) {
    return { ok: true, review: (await response.json()) as Review };
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  return {
    ok: false,
    message: body?.error ?? "Could not submit your review. Please try again.",
    fieldErrors: toReviewFieldErrors(body?.fieldErrors ?? {}),
  };
}
