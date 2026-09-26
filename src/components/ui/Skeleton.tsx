import { cn } from "@/lib/cn";
import styles from "./Skeleton.module.css";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn(styles.skeleton, className)} aria-hidden="true" />;
}
