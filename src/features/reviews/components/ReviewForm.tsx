"use client";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input, Select, Textarea } from "@/components/ui/FormControls";
import { REVIEW_LIMITS } from "../schema";
import { useReviewForm } from "./useReviewForm";
import styles from "./ReviewForm.module.css";

const RATING_OPTIONS = [5, 4, 3, 2, 1] as const;

export function ReviewForm({ productId }: { productId: number }) {
  const { values, errors, status, isSubmitting, setField, handleSubmit } = useReviewForm(productId);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div>
        <h3 className={styles.title}>Write a review</h3>
        <p className={styles.subtitle}>Share your experience with other shoppers.</p>
      </div>

      <FormField label="Your name" error={errors.author}>
        {(control) => (
          <Input
            {...control}
            name="author"
            autoComplete="name"
            maxLength={REVIEW_LIMITS.authorMax}
            value={values.author}
            onChange={(event) => setField("author", event.target.value)}
          />
        )}
      </FormField>

      <FormField label="Rating" error={errors.rating}>
        {(control) => (
          <Select
            {...control}
            name="rating"
            value={values.rating}
            onChange={(event) => setField("rating", event.target.value)}
          >
            <option value="">Select a rating</option>
            {RATING_OPTIONS.map((rating) => (
              <option key={rating} value={rating}>
                {"★".repeat(rating)} ({rating})
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField
        label="Comment"
        error={errors.comment}
        hint={`${values.comment.trim().length}/${REVIEW_LIMITS.commentMax} characters`}
      >
        {(control) => (
          <Textarea
            {...control}
            name="comment"
            rows={4}
            maxLength={REVIEW_LIMITS.commentMax}
            value={values.comment}
            onChange={(event) => setField("comment", event.target.value)}
          />
        )}
      </FormField>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit review"}
      </Button>

      <div aria-live="polite">
        {status.kind === "success" && (
          <p className={styles.success}>Thanks! Your review has been posted.</p>
        )}
        {status.kind === "error" && <p className={styles.error}>{status.message}</p>}
      </div>
    </form>
  );
}
