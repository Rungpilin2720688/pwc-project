import { NextResponse, type NextRequest } from "next/server";
import { parseProductQuery } from "@/features/products/query";
import { listProducts } from "@/features/products/repository";

export async function GET(request: NextRequest) {
  const query = parseProductQuery(request.nextUrl.searchParams);
  const result = await listProducts(query);
  return NextResponse.json(result);
}
