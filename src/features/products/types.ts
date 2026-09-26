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
