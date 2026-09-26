import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

type Props = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className={styles.emptyState}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
