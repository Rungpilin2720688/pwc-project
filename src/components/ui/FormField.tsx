import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import styles from "./FormField.module.css";

export type FieldControlProps = {
  id: string;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

type FormFieldProps = {
  label: string;
  error?: string;
  hint?: ReactNode;
  className?: string;
  children: (control: FieldControlProps) => ReactNode;
};

export function FormField({ label, error, hint, className, children }: FormFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className={styles.error}>
      {children}
    </p>
  );
}
