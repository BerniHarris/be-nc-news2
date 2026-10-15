import { jest } from "@jest/globals";

import {
  error404,
  error500,
  customError,
  psqlError,
} from "../../helpers/errors/errorHandler.js";

describe("Error Handling Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("psqlError", () => {
    test("handles 22P02", () => {
      const err = { code: "22P02" };

      psqlError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Invalid input." });
      expect(next).not.toHaveBeenCalled();
    });
    test("handles 23503 for invalid usernames", () => {
      const err = {
        code: "23503",
        detail: 'Key (author)=(not_a_user) is not present in table "users".',
      };

      psqlError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Username not found." });
      expect(next).not.toHaveBeenCalled();
    });
    test("handles 23503 for invalid articles", () => {
      const err = {
        code: "23503",
        detail:
          'Key (article_id)=(not_an_article) is not present in table "articles".',
      };

      psqlError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Article not found." });
      expect(next).not.toHaveBeenCalled();
    });
    test("calls next for unhandled postgres errors", () => {
      const err = { code: "99999" };
      psqlError(err, req, res, next);
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("customError", () => {
    test("handles custom error", () => {
      const err = { status: 404, message: "Not found" };

      customError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Not found" });
      expect(next).not.toHaveBeenCalled();
    });
    test("calls next if no error message included", () => {
      const err = { status: 404 };

      customError(err, req, res, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test("calls next if no error status included", () => {
      const err = { message: "oops" };

      customError(err, req, res, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test("ignores extra fields and still sends correct error", () => {
      const err = { status: 400, message: "Bad request", foo: "bar" };
      customError(err, req, res, next);
      expect(res.send).toHaveBeenCalledWith({ message: "Bad request" });
    });
    test("does not call next when both status and message exist", () => {
      const err = { status: 400, message: "Bad request" };
      customError(err, req, res, next);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("error404", () => {
    test("returns path not found", () => {
      error404(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Path not found." });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("error500", () => {
    test("returns internal server error", () => {
      const err = new Error("Oh no!");

      error500(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
