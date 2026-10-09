import { queryArticleValidation } from "../../helpers/validation/articles.validation.js";

describe("queryArticleValidation", () => {
  describe("validating sort_by", () => {
    test.each([["I'm not allowed"], [1], [NaN], [undefined]])(
      "should return 400 if invalid sort of %s is passed",
      (sorted) => {
        const result = queryArticleValidation(sorted, "desc", "topic");
        expect(result.status).toBe(400);
      },
    );
    test('should return message "Invalid sort_by" when passed an invalid sort type', () => {
      const result = queryArticleValidation("wrongwrongwrong", "desc", "topic");
      expect(result.message).toBe("Invalid sort_by");
    });
    test.each([
      ["author"],
      ["title"],
      ["topic"],
      ["created_at"],
      ["votes"],
      ["article_id"],
      ["article_img_url"],
      ["comment_count"],
    ])("should return null if valid sort of %s is passed", (sorted) => {
      const result = queryArticleValidation(sorted, "desc", "topic");
      expect(result).toBe(null);
    });
  });

  describe("validating order", () => {
    test.each([["new-old"], [1], [NaN], [undefined]])(
      "should return 400 if invalid order of %s is passed",
      (order) => {
        const result = queryArticleValidation("created_at", order, "topic");
        expect(result.status).toBe(400);
      },
    );
    test('should return message "Invalid order" when passed an invalid order type', () => {
      const result = queryArticleValidation(
        "created_at",
        "wrongwrongwrong",
        "topic",
      );
      expect(result.message).toBe("Invalid order");
    });
    test.each([["asc"], ["desc"]])(
      "should return null if valid order of %s is passed",
      (order) => {
        const result = queryArticleValidation("created_at", order, "topic");
        expect(result).toBe(null);
      },
    );
  });

  describe("validating topic", () => {
    test.each([[true], [1], [{}]])(
      "should return 404 if invalid topic of %s is passed",
      (topic) => {
        const result = queryArticleValidation("created_at", "desc", topic);
        expect(result.status).toBe(404);
      },
    );
    test('should return message "Invalid topic" when passed an invalid topic', () => {
      const result = queryArticleValidation("created_at", "desc", 3456);
      expect(result.message).toBe("Invalid topic");
    });
    test("should return null if a topic string is passed", () => {
      const result = queryArticleValidation("created_at", "desc", "topic");
      expect(result).toBe(null);
    });
    test("should return null if no topic string is passed", () => {
      const result = queryArticleValidation("created_at", "desc");
      expect(result).toBe(null);
    });
  });
});
