import request from "supertest";
import app from "../app.js";
import db from "../db/connection.js";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "endpoints.json");
const endpointsJson = JSON.parse(await fs.readFile(filePath, "utf8"));

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
