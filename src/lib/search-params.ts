/** Shape of `searchParams` as Next.js passes it to pages. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/** Collapses repeated keys (`?a=1&a=2`) to their first value so parsing is predictable. */
export function firstValues(input: RawSearchParams | URLSearchParams): Record<string, string | undefined> {
  if (input instanceof URLSearchParams) {
    const result: Record<string, string> = {};
    for (const key of input.keys()) {
      result[key] ??= input.get(key) ?? "";
    }
    return result;
  }
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}
