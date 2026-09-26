import { RatingStars } from "@/components/RatingStars";
import { formatDate } from "@/lib/format";
import type { Review } from "../types";

type Props = {
  reviews: Review[];
  totalCount: number;
};

export function ReviewList({ reviews, totalCount }: Props) {
  if (reviews.length === 0) {
    return <p className="muted">No reviews yet. Be the first to review this product.</p>;
  }

  return (
    <>
      {totalCount > reviews.length && (
        <p className="muted">
          Showing the latest {reviews.length} of {totalCount} reviews.
        </p>
      )}
      <ul className="review-list">
        {reviews.map((review) => (
          <li key={review.id} className="review">
            <div className="review__header">
              <strong>{review.author}</strong>
              <RatingStars rating={review.rating} />
              <time dateTime={review.createdAt} className="muted">
                {formatDate(review.createdAt)}
              </time>
            </div>
            <p className="review__comment">{review.comment}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
