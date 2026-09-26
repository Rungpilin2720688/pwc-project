/**
 * Domain types exposed to the UI and API. They intentionally differ from the Prisma models
 * (e.g. `price` is a plain number, not a Decimal) so the persistence layer can change freely.
 */
export type ProductSummary = {
  id: number;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
};

export type ProductDetail = ProductSummary & {
  description: string;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};
