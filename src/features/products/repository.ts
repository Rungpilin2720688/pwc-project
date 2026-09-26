import "server-only";
import type { Prisma, Product } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PAGE_SIZE, type ProductQuery, type SortField } from "./query";
import type { Paginated, ProductDetail, ProductSummary } from "./types";

const SORT_COLUMNS: Record<SortField, keyof Prisma.ProductOrderByWithRelationInput> = {
  name: "name",
  price: "price",
  rating: "ratingAvg",
};

const summarySelect = {
  id: true,
  name: true,
  price: true,
  category: true,
  ratingAvg: true,
  reviewCount: true,
  imageUrl: true,
} satisfies Prisma.ProductSelect;

type SummaryRow = Pick<Product, keyof typeof summarySelect>;

function toSummary(row: SummaryRow): ProductSummary {
  return {
    id: row.id,
    name: row.name,
    price: row.price.toNumber(),
    category: row.category,
    rating: row.ratingAvg,
    reviewCount: row.reviewCount,
    imageUrl: row.imageUrl,
  };
}

export async function listProducts(query: ProductQuery): Promise<Paginated<ProductSummary>> {
  const where: Prisma.ProductWhereInput = {
    category: query.category,
    price: { gte: query.minPrice, lte: query.maxPrice },
  };

  const [rows, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: summarySelect,
      orderBy: [{ [SORT_COLUMNS[query.sort]]: query.dir }, { id: "asc" }],
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items: rows.map(toSummary),
    page: query.page,
    pageSize: PAGE_SIZE,
    total,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function listCategories(): Promise<string[]> {
  const groups = await prisma.product.groupBy({ by: ["category"], orderBy: { category: "asc" } });
  return groups.map((group) => group.category);
}

export async function getProductById(id: number): Promise<ProductDetail | null> {
  const row = await prisma.product.findUnique({
    where: { id },
    select: { ...summarySelect, description: true },
  });
  return row ? { ...toSummary(row), description: row.description } : null;
}
