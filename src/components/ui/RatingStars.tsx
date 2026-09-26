import { formatRating } from "@/lib/format";
import styles from "./RatingStars.module.css";

type Props = {
  rating: number;
  reviewCount?: number;
};

export function RatingStars({ rating, reviewCount }: Props) {
  const filled = Math.round(rating);
  const label = reviewCount === 0 ? "No reviews yet" : `Rated ${formatRating(rating)} out of 5`;

  return (
    <span className={styles.rating} role="img" aria-label={label}>
      <span aria-hidden="true">
        <span className={styles.filled}>{"★".repeat(filled)}</span>
        <span className={styles.empty}>{"★".repeat(5 - filled)}</span>
      </span>
      {reviewCount !== undefined && (
        <span className={styles.meta} aria-hidden="true">
          {reviewCount === 0 ? "No reviews" : `${formatRating(rating)} · ${reviewCount.toLocaleString("en-US")}`}
        </span>
      )}
    </span>
  );
}
