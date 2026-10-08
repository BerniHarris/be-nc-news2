import request from "supertest";
import app from "../app.js";
import db from "../db/connection.js";
import fs from "fs/promises";
import path from "path";
import testData from "../db/data/test-data/index.js";
import seed from "../db/seeds/seed.js";

const filePath = path.join(process.cwd(), "endpoints.json");
const endpointsJson = JSON.parse(await fs.readFile(filePath, "utf8"));

beforeEach(() => {
  return seed(testData);
});

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

describe("GET /api/topics", () => {
  test("200: Responds with a topics array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toBeDefined();
        expect(topics).toEqual(expect.any(Array));
      });
  });
  test("Returns the correct number of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
      });
  });
  test("Each topic returned includes the correct keys", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            }),
          ]),
        );
      });
  });
  test("Returns the correct data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toEqual([
          { description: "The man, the Mitch, the legend", slug: "mitch" },
          { description: "Not dogs", slug: "cats" },
          { description: "what books are made of", slug: "paper" },
        ]);
      });
  });
});
