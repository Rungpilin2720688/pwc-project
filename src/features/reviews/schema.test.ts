import { describe, expect, it } from "vitest";
import { validateReviewInput } from "./schema";

const valid = { author: "Mai", rating: 5, comment: "Great product, would buy again." };

describe("validateReviewInput", () => {
  it("accepts a valid review and trims whitespace", () => {
    const result = validateReviewInput({ ...valid, author: "  Mai  " });
    expect(result).toEqual({ success: true, data: valid });
  });

  it("coerces a numeric string rating from form input", () => {
    const result = validateReviewInput({ ...valid, rating: "4" });
    expect(result.success && result.data.rating).toBe(4);
  });

  it("reports an error per invalid field", () => {
    const result = validateReviewInput({ author: "A", rating: "", comment: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.author).toMatch(/at least 2/);
      expect(result.errors.rating).toBe("Please choose a rating");
      expect(result.errors.comment).toMatch(/at least 10/);
    }
  });

  it.each([0, 6, 3.5])("rejects rating %s", (rating) => {
    expect(validateReviewInput({ ...valid, rating }).success).toBe(false);
  });
});
