import { describe, expect, it } from "vitest";
import { parsePriceRange, parseProductId, parseProductQuery, serializeProductQuery } from "./query";

describe("parseProductQuery", () => {
  it("returns defaults for an empty URL", () => {
    expect(parseProductQuery({})).toEqual({
      category: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "name",
      dir: "asc",
      page: 1,
    });
  });

  it("parses a fully specified URL", () => {
    const query = parseProductQuery(
      new URLSearchParams("category=Books&minPrice=10&maxPrice=50.5&sort=price&dir=desc&page=3"),
    );
    expect(query).toEqual({ category: "Books", minPrice: 10, maxPrice: 50.5, sort: "price", dir: "desc", page: 3 });
  });

  it("falls back to defaults for invalid values instead of throwing", () => {
    const query = parseProductQuery({ sort: "hacked", dir: "sideways", page: "-4", minPrice: "abc", category: "  " });
    expect(query).toMatchObject({ sort: "name", dir: "asc", page: 1, minPrice: undefined, category: undefined });
  });

  it("treats empty price strings as unset (not zero)", () => {
    expect(parseProductQuery({ minPrice: "", maxPrice: "" })).toMatchObject({ minPrice: undefined, maxPrice: undefined });
  });

  it("uses the first value when a key is repeated", () => {
    expect(parseProductQuery({ category: ["Toys", "Books"] }).category).toBe("Toys");
  });
});

describe("serializeProductQuery", () => {
  it("omits defaults to keep URLs canonical", () => {
    expect(serializeProductQuery({ sort: "name", dir: "asc", page: 1 })).toBe("");
  });

  it("round-trips through parse", () => {
    const original = parseProductQuery({ category: "Home", minPrice: "5", sort: "rating", dir: "desc", page: "2" });
    const roundTripped = parseProductQuery(new URLSearchParams(serializeProductQuery(original)));
    expect(roundTripped).toEqual(original);
  });
});

describe("parsePriceRange", () => {
  it("treats blank inputs as no bound", () => {
    expect(parsePriceRange("", " ")).toEqual({ ok: true, minPrice: undefined, maxPrice: undefined });
  });

  it("parses valid bounds", () => {
    expect(parsePriceRange("10", "99.5")).toEqual({ ok: true, minPrice: 10, maxPrice: 99.5 });
  });

  it.each([
    ["-1", ""],
    ["abc", ""],
    ["", "-5"],
  ])("rejects invalid input min=%s max=%s", (min, max) => {
    expect(parsePriceRange(min, max)).toEqual({ ok: false, error: "Prices must be positive numbers." });
  });

  it("rejects min greater than max", () => {
    expect(parsePriceRange("50", "10")).toEqual({ ok: false, error: "Min price cannot be greater than max price." });
  });
});

describe("parseProductId", () => {
  it.each([
    ["1", 1],
    ["25000", 25000],
    ["0", null],
    ["012", null],
    ["1e3", null],
    ["12abc", null],
    ["99999999999", null],
  ])("parses %s as %s", (input, expected) => {
    expect(parseProductId(input)).toBe(expected);
  });
});
