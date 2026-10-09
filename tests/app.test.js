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

describe("GET /api/articles", () => {
  test("200: Responds with an articles array", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    const articles = body.articles;
    expect(articles).toBeDefined();
    expect(articles).toEqual(expect.any(Array));
  });
  test("Returns the correct number of articles", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles).toHaveLength(13);
  });
  test("Each article includes: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        }),
      ]),
    );
  });
  test("Returned articles exclude article body", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles[0].body).not.toBeDefined();
    expect(body.articles).toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({
          body: expect.any(String),
        }),
      ]),
    );
  });
  test("Returned articles are sorted in DESC order of the articles created_at date field by default ", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);
    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });
});
// separate tests
describe("Sort articles by", () => {
  test.each([
    ["author", "asc"],
    ["title", "asc"],
    ["topic", "asc"],
    ["created_at", "asc"],
    ["votes", "asc"],
    ["article_id", "asc"],
    ["article_img_url", "asc"],
    ["comment_count", "asc"],
    ["author", "desc"],
    ["title", "desc"],
    ["topic", "desc"],
    ["created_at", "desc"],
    ["votes", "desc"],
    ["article_id", "desc"],
    ["article_img_url", "desc"],
    ["comment_count", "desc"],
  ])(
    "Correctly sorts articles by %s in %s order when requested",
    async (sort_by, order) => {
      const { body } = await request(app)
        .get(`/api/articles?sort_by=${sort_by}&&order=${order}`)
        .expect(200);

      const isOrderDesc = order === "desc";
      expect(body.articles).toBeSortedBy(sort_by, {
        descending: isOrderDesc,
      });
    },
  );
});
