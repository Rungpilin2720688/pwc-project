export type Review = {
  id: string;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  /** ISO 8601 string so the type is safe to serialise across the server/client boundary. */
  createdAt: string;
};
