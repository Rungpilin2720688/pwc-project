import { Skeleton } from "@/components/ui/Skeleton";
import cardStyles from "./ProductCard.module.css";
import gridStyles from "./ProductGrid.module.css";
import styles from "./ProductGridSkeleton.module.css";

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <ul className={gridStyles.grid} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={cardStyles.card}>
          <Skeleton className={styles.image} />
          <div className={cardStyles.body}>
            <Skeleton className={styles.badge} />
            <Skeleton className={styles.line} />
            <Skeleton className={styles.shortLine} />
          </div>
        </li>
      ))}
    </ul>
  );
}
