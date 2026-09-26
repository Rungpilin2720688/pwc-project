import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { submitReview } from "../api";
import { validateReviewInput, type ReviewFieldErrors } from "../schema";

export type ReviewFormValues = {
  author: string;
  rating: string;
  comment: string;
};

export type ReviewFormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const EMPTY_VALUES: ReviewFormValues = { author: "", rating: "", comment: "" };

export function useReviewForm(productId: number) {
  const router = useRouter();
  const [values, setValues] = useState<ReviewFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ReviewFieldErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [status, setStatus] = useState<ReviewFormStatus>({ kind: "idle" });

  function setField(field: keyof ReviewFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (hasAttemptedSubmit) {
      const result = validateReviewInput(next);
      setErrors(result.success ? {} : result.errors);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const validation = validateReviewInput(values);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });
    const result = await submitReview(productId, validation.data);

    if (!result.ok) {
      setErrors(result.fieldErrors);
      setStatus({ kind: "error", message: result.message });
      return;
    }

    setValues(EMPTY_VALUES);
    setHasAttemptedSubmit(false);
    setStatus({ kind: "success" });
    router.refresh();
  }

  return {
    values,
    errors,
    status,
    isSubmitting: status.kind === "submitting",
    setField,
    handleSubmit,
  };
}
