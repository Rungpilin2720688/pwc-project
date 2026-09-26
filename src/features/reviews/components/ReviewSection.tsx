import type { Review } from "../types";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import styles from "./ReviewSection.module.css";

type Props = {
  productId: number;
  reviews: Review[];
  totalCount: number;
};

export function ReviewSection({ productId, reviews, totalCount }: Props) {
  return (
    <section className={styles.section} aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className={styles.heading}>
        Customer reviews <span className={styles.count}>({totalCount.toLocaleString("en-US")})</span>
      </h2>
      <div className={styles.layout}>
        <ReviewList reviews={reviews} totalCount={totalCount} />
        <ReviewForm productId={productId} />
      </div>
    </section>
  );
}
