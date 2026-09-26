import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./FormControls.module.css";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(styles.control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(styles.control, styles.select, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(styles.control, styles.textarea, className)} {...props} />;
}
