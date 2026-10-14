import { validateId } from "./validation.js";

export const validateComment = (articleId, username, body) => {
  validateId(articleId, "article");

  if (!username || !body) {
    return {
      status: 400,
      message: "Comment must include both a body and username",
    };
  }

  if (typeof username !== "string") {
    return { status: 400, message: "Invalid username" };
  }
  if (typeof body !== "string") {
    return { status: 400, message: "Invalid comment body" };
  }

  return null;
};
