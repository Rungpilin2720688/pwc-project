import { z } from "zod";
import { firstValues, type RawSearchParams } from "@/lib/search-params";

export const SORT_FIELDS = ["name", "price", "rating"] as const;
export const SORT_DIRECTIONS = ["asc", "desc"] as const;
export const PAGE_SIZE = 24;
const MAX_PAGE = 10_000;

export type SortField = (typeof SORT_FIELDS)[number];
export type SortDirection = (typeof SORT_DIRECTIONS)[number];

const DEFAULTS = { sort: "name", dir: "asc", page: 1 } as const;

const optionalPrice = z
  .preprocess((value) => (value === "" ? undefined : value), z.coerce.number().finite().nonnegative().optional())
  .catch(undefined);

export const productQuerySchema = z.object({
  category: z.string().trim().min(1).max(100).optional().catch(undefined),
  minPrice: optionalPrice,
  maxPrice: optionalPrice,
  sort: z.enum(SORT_FIELDS).catch(DEFAULTS.sort),
  dir: z.enum(SORT_DIRECTIONS).catch(DEFAULTS.dir),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).catch(DEFAULTS.page),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export function parseProductQuery(input: RawSearchParams | URLSearchParams): ProductQuery {
  return productQuerySchema.parse(firstValues(input));
}

export function serializeProductQuery(query: Partial<ProductQuery>): string {
  const params = new URLSearchParams();
  if (query.category) params.set("category", query.category);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.sort && query.sort !== DEFAULTS.sort) params.set("sort", query.sort);
  if (query.dir && query.dir !== DEFAULTS.dir) params.set("dir", query.dir);
  if (query.page && query.page !== DEFAULTS.page) params.set("page", String(query.page));
  return params.toString();
}

export function productsHref(query: Partial<ProductQuery>): string {
  const qs = serializeProductQuery(query);
  return qs ? `/products?${qs}` : "/products";
}

export type PriceRangeResult =
  | { ok: true; minPrice: number | undefined; maxPrice: number | undefined }
  | { ok: false; error: string };

export function parsePriceRange(minRaw: string, maxRaw: string): PriceRangeResult {
  const toPrice = (raw: string) => (raw.trim() === "" ? undefined : Number(raw));
  const isInvalid = (value: number | undefined) => value !== undefined && (!Number.isFinite(value) || value < 0);

  const minPrice = toPrice(minRaw);
  const maxPrice = toPrice(maxRaw);

  if (isInvalid(minPrice) || isInvalid(maxPrice)) {
    return { ok: false, error: "Prices must be positive numbers." };
  }
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return { ok: false, error: "Min price cannot be greater than max price." };
  }
  return { ok: true, minPrice, maxPrice };
}

export function parseProductId(raw: string): number | null {
  if (!/^[1-9]\d{0,9}$/.test(raw)) return null;
  const id = Number(raw);
  return id <= 2_147_483_647 ? id : null;
}
