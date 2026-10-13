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
    test("handles 23503", () => {
      const err = { code: "23503" };

      psqlError(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Input not found." });
      expect(next).not.toHaveBeenCalled();
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
      const err = { status: 404 };

      customError(err, req, res, next);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("error404", () => {
    test("returns path not found", () => {
      error404(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Path not found." });
    });
  });

  describe("error500", () => {
    test("returns internal server error", () => {
      const err = new Error("Oh no!");

      error500(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });
  });
});
