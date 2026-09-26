import { RatingStars } from "@/components/ui/RatingStars";
import { formatDate } from "@/lib/format";
import type { Review } from "../types";
import styles from "./ReviewItem.module.css";

export function ReviewItem({ review }: { review: Review }) {
  return (
    <li className={styles.review}>
      <div className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">
          {review.author.charAt(0).toUpperCase()}
        </span>
        <div className={styles.meta}>
          <strong>{review.author}</strong>
          <time dateTime={review.createdAt} className={styles.date}>
            {formatDate(review.createdAt)}
          </time>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className={styles.comment}>{review.comment}</p>
    </li>
  );
}
