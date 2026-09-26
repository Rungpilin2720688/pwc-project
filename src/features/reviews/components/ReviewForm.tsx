"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { REVIEW_LIMITS, validateReviewInput, type ReviewFieldErrors } from "../schema";

type FormValues = {
  author: string;
  rating: string;
  comment: string;
};

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

const EMPTY: FormValues = { author: "", rating: "", comment: "" };

type ApiErrorBody = { error?: string; fieldErrors?: Partial<Record<keyof FormValues, string[]>> };

export function ReviewForm({ productId }: { productId: number }) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<ReviewFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function update(field: keyof FormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    // Only re-validate live after the first submit attempt, to avoid shouting at the user while typing.
    if (submitted) {
      const result = validateReviewInput(next);
      setErrors(result.success ? {} : result.errors);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const result = validateReviewInput(values);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ApiErrorBody;
        if (body.fieldErrors) {
          setErrors({
            author: body.fieldErrors.author?.[0],
            rating: body.fieldErrors.rating?.[0],
            comment: body.fieldErrors.comment?.[0],
          });
        }
        setStatus({ kind: "error", message: body.error ?? "Could not submit your review. Please try again." });
        return;
      }

      setValues(EMPTY);
      setSubmitted(false);
      setStatus({ kind: "success" });
      // Re-render the server components so the new review and updated rating appear.
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  const isSubmitting = status.kind === "submitting";

  return (
    <form className="review-form" onSubmit={handleSubmit} noValidate>
      <h3>Write a review</h3>

      <label className="field">
        <span>Your name</span>
        <input
          name="author"
          value={values.author}
          maxLength={REVIEW_LIMITS.authorMax}
          onChange={(event) => update("author", event.target.value)}
          aria-invalid={errors.author ? true : undefined}
          aria-describedby={errors.author ? "author-error" : undefined}
        />
        {errors.author && (
          <span id="author-error" className="field-error">
            {errors.author}
          </span>
        )}
      </label>

      <label className="field">
        <span>Rating</span>
        <select
          name="rating"
          value={values.rating}
          onChange={(event) => update("rating", event.target.value)}
          aria-invalid={errors.rating ? true : undefined}
          aria-describedby={errors.rating ? "rating-error" : undefined}
        >
          <option value="">Select a rating</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)} ({n})
            </option>
          ))}
        </select>
        {errors.rating && (
          <span id="rating-error" className="field-error">
            {errors.rating}
          </span>
        )}
      </label>

      <label className="field">
        <span>Comment</span>
        <textarea
          name="comment"
          rows={4}
          value={values.comment}
          maxLength={REVIEW_LIMITS.commentMax}
          onChange={(event) => update("comment", event.target.value)}
          aria-invalid={errors.comment ? true : undefined}
          aria-describedby={errors.comment ? "comment-error comment-count" : "comment-count"}
        />
        <span id="comment-count" className="muted small">
          {values.comment.trim().length}/{REVIEW_LIMITS.commentMax}
        </span>
        {errors.comment && (
          <span id="comment-error" className="field-error">
            {errors.comment}
          </span>
        )}
      </label>

      <button type="submit" className="button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit review"}
      </button>

      <div aria-live="polite">
        {status.kind === "success" && <p className="success">Thanks! Your review has been posted.</p>}
        {status.kind === "error" && <p className="field-error">{status.message}</p>}
      </div>
    </form>
  );
}
