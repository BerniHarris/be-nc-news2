import { validateComment } from "../../helpers/validation/comments.validation.js";

describe("validateComment", () => {
  test("returns null when passed valid id, body and author", () => {
    const result = validateComment(1, "Im a valid body", "validUser");
    expect(result).toBe(null);
  });
  test("400 is returned when there is a missing body", () => {
    const result = validateComment(1, null, "validUser");
    expect(result.status).toBe(400);
    expect(result.message).toBe(
      "Comment must include both a body and username",
    );
  });
  test("400 is returned when there is a missing author", () => {
    const result = validateComment(1, "oh no! missing author!");
    expect(result.status).toBe(400);
    expect(result.message).toBe(
      "Comment must include both a body and username",
    );
  });
  test("400 is returned when the body passed isn't a string", () => {
    const numericBody = validateComment(1, "sillyBanana", 123);
    const booleanBody = validateComment(1, "sillyBanana", true);
    const objectBody = validateComment(1, "sillyBanana", {});

    expect(numericBody.status).toBe(400);
    expect(numericBody.message).toBe("Invalid comment body");
    expect(booleanBody.status).toBe(400);
    expect(numericBody.message).toBe("Invalid comment body");
    expect(objectBody.status).toBe(400);
    expect(objectBody.message).toBe("Invalid comment body");
  });
  test("400 is returned when the body passed isn't a string", () => {
    const numericAuthor = validateComment(1, 123, "sillyBanana");
    const booleanAuthor = validateComment(1, true, "sillyBanana");
    const objectAuthor = validateComment(1, {}, "sillyBanana");

    expect(numericAuthor.status).toBe(400);
    expect(numericAuthor.message).toBe("Invalid username");
    expect(booleanAuthor.status).toBe(400);
    expect(booleanAuthor.message).toBe("Invalid username");
    expect(objectAuthor.status).toBe(400);
    expect(objectAuthor.message).toBe("Invalid username");
  });
});
