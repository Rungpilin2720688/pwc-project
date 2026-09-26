import { z } from "zod";

export const REVIEW_LIMITS = {
  authorMin: 2,
  authorMax: 60,
  commentMin: 10,
  commentMax: 1000,
} as const;

export const reviewInputSchema = z.object({
  author: z
    .string()
    .trim()
    .min(REVIEW_LIMITS.authorMin, `Name must be at least ${REVIEW_LIMITS.authorMin} characters`)
    .max(REVIEW_LIMITS.authorMax, `Name must be at most ${REVIEW_LIMITS.authorMax} characters`),
  rating: z.coerce
    .number({ invalid_type_error: "Please choose a rating" })
    .int("Please choose a rating")
    .min(1, "Please choose a rating")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .trim()
    .min(REVIEW_LIMITS.commentMin, `Comment must be at least ${REVIEW_LIMITS.commentMin} characters`)
    .max(REVIEW_LIMITS.commentMax, `Comment must be at most ${REVIEW_LIMITS.commentMax} characters`),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
export type ReviewFieldErrors = Partial<Record<keyof ReviewInput, string>>;

export function validateReviewInput(
  input: unknown,
): { success: true; data: ReviewInput } | { success: false; errors: ReviewFieldErrors } {
  const result = reviewInputSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const fieldErrors = result.error.flatten().fieldErrors;
  return {
    success: false,
    errors: {
      author: fieldErrors.author?.[0],
      rating: fieldErrors.rating?.[0],
      comment: fieldErrors.comment?.[0],
    },
  };
}
