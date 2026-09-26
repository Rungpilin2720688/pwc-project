import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

function buttonClassName(variant: Variant, className?: string) {
  return cn(styles.button, styles[variant], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", type = "button", className, ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = "secondary", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
