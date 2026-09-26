import { formatRating } from "@/lib/format";

type Props = {
  rating: number;
  reviewCount?: number;
};

export function RatingStars({ rating, reviewCount }: Props) {
  const filled = Math.round(rating);
  const label =
    reviewCount === 0 ? "No reviews yet" : `Rated ${formatRating(rating)} out of 5`;

  return (
    <span className="rating" aria-label={label} title={label}>
      <span aria-hidden="true" className="rating__stars">
        {"★".repeat(filled)}
        <span className="rating__empty">{"★".repeat(5 - filled)}</span>
      </span>
      {reviewCount !== undefined && (
        <span className="rating__meta" aria-hidden="true">
          {reviewCount === 0 ? "No reviews" : `${formatRating(rating)} (${reviewCount})`}
        </span>
      )}
    </span>
  );
}
