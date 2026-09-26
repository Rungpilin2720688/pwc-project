import { EmptyState } from "@/components/ui/EmptyState";
import type { Review } from "../types";
import { ReviewItem } from "./ReviewItem";
import styles from "./ReviewList.module.css";

type Props = {
  reviews: Review[];
  totalCount: number;
};

export function ReviewList({ reviews, totalCount }: Props) {
  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" description="Be the first to review this product." />;
  }

  return (
    <div className={styles.wrapper}>
      {totalCount > reviews.length && (
        <p className={styles.notice}>
          Showing the latest {reviews.length} of {totalCount.toLocaleString("en-US")} reviews.
        </p>
      )}
      <ul className={styles.list}>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </div>
  );
}
