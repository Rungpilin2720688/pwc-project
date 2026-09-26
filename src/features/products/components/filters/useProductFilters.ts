import { useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { productsHref, type ProductQuery } from "../../query";

export function useProductFilters(query: ProductQuery) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const applyFilters = useCallback(
    (changes: Partial<ProductQuery>) => {
      startTransition(() => router.push(productsHref({ ...query, ...changes, page: 1 })));
    },
    [query, router],
  );

  return { applyFilters, isPending };
}
