import { expect, jest, test } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import db from "../db/connection.js";
import fs from "fs/promises";
import path from "path";
import testData from "../db/data/test-data/index.js";
import seed from "../db/seeds/seed.js";

const filePath = path.join(process.cwd(), "endpoints.json");
const endpointsJson = JSON.parse(await fs.readFile(filePath, "utf8"));

describe("be nc news2", () => {
  beforeEach(() => {
    return seed(testData);
  });

  afterAll(() => {
    return db.end();
  });
  describe("GET /api", () => {
    test("200: Responds with an object detailing the documentation for each endpoint", async () => {
      const {
        body: { endpoints },
      } = await request(app).get("/api").expect(200);
      expect(endpoints).toEqual(endpointsJson);
    });
  });

  describe("GET /api/topics", () => {
    test("200: Responds with a topics array", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
      const topics = body.topics;
      expect(topics).toBeDefined();
      expect(topics).toEqual(expect.any(Array));
    });
    test("200: Returns the correct number of topics", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
      expect(body.topics).toHaveLength(3);
    });
    test("200: Each topic returned includes the correct keys", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
      expect(body.topics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            description: expect.any(String),
            slug: expect.any(String),
          }),
        ]),
      );
    });
    test("200: Returns the correct data", async () => {
      const { body } = await request(app).get("/api/topics").expect(200);
      expect(body.topics).toEqual([
        { description: "The man, the Mitch, the legend", slug: "mitch" },
        { description: "Not dogs", slug: "cats" },
        { description: "what books are made of", slug: "paper" },
      ]);
    });
  });

  describe("GET /api/articles", () => {
    test("200: Responds with an articles array", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      const articles = body.articles;
      expect(articles).toBeDefined();
      expect(articles).toEqual(expect.any(Array));
    });
    test("200: Returns the correct number of articles", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toHaveLength(13);
    });
    test("200: Each article includes: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", async () => {
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
    test("200: Returned articles exclude article body", async () => {
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

    test("200: Returned articles are sorted in DESC order of the articles created_at date field by default ", async () => {
      const { body } = await request(app).get("/api/articles").expect(200);
      expect(body.articles).toBeSortedBy("created_at", { descending: true });
    });

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
        "200: Correctly sorts articles by %s in %s order when requested",
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
  });

  describe('"GET /api/articles/:article_id"', () => {
    test("200: Responds with a single article object", async () => {
      const { body } = await request(app).get("/api/articles/12").expect(200);
      expect(body).toBeInstanceOf(Object);
    });
    test("200: Article object includes the correct keys", async () => {
      const { body } = await request(app).get("/api/articles/12").expect(200);
      expect(body.article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          topic: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_id: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        }),
      );
    });
    test("200: Returns the correct article object", async () => {
      const article12 = {
        author: "butter_bridge",
        title: "Moustache",
        topic: "mitch",
        body: "Have you seen the size of that thing?",
        votes: 0,
        article_id: 12,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 0,
      };
      const { body } = await request(app).get("/api/articles/12").expect(200);
      expect(body.article).toEqual(expect.objectContaining(article12));
      expect(body.article.created_at).toBe("2020-10-11T11:24:00.000Z");
    });
    test("200 includes comment_count key in the response along with the correct number", async () => {
      const numOfComments = 0;
      const { body } = await request(app).get("/api/articles/12").expect(200);
      expect(body.article.comment_count).toEqual(numOfComments);
    });
    test("404: article not found", async () => {
      const { body } = await request(app).get("/api/articles/9999").expect(404);
      expect(body.message).toBe("Article not found");
    });
    test("400: article_id invalid", async () => {
      const { body } = await request(app)
        .get("/api/articles/wrong")
        .expect(400);
      expect(body.message).toBe("Invalid article id");
    });
  });

  describe("GET /api/users", () => {
    test("200: Responds with a users array", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      const users = body.users;
      expect(users).toBeDefined();
      expect(users).toEqual(expect.any(Array));
    });
    test("200: Returns the correct number of users", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users).toHaveLength(4);
    });
    test("200: Each user returned includes the correct keys", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          }),
        ]),
      );
    });
    test("200: Returns the correct data", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users).toEqual([
        {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        },
        {
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        },
        {
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        },
        {
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        },
      ]);
    });
  });

  describe("GET /api/articles/:article_id/comments", () => {
    const article5Comments = [
      {
        body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
        votes: 16,
        author: "icellusedkars",
        article_id: 5,
        created_at: "2020-06-09T05:00:00.000Z",
        comment_id: 14,
      },
      {
        body: "I am 100% sure that we're not completely sure.",
        votes: 1,
        author: "butter_bridge",
        article_id: 5,
        created_at: "2020-11-24T00:08:00.000Z",
        comment_id: 15,
      },
    ];

    test("200: responds with an array of comment objects", async () => {
      const { body } = await request(app)
        .get("/api/articles/5/comments")
        .expect(200);
      expect(body.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 5,
            created_at: expect.any(String),
          }),
        ]),
      );
    });
    test("200: responds with correct array of comment objects when given a valid article_id", async () => {
      const { body } = await request(app)
        .get("/api/articles/5/comments")
        .expect(200);
      expect(body.comments).toEqual(article5Comments);
      expect(body.comments.length).toBe(2);
    });
    test("400: responds with the correct error message when passed an invalid article_id", async () => {
      const response = await request(app)
        .get("/api/articles/wrongwrongwrong/comments")
        .expect(400);
      expect(response.body.message).toBe("Invalid article id");
    });

    test("404: responds with the correct error message when passed a valid but non-existent article_id", async () => {
      const response = await request(app)
        .get("/api/articles/9999/comments")
        .expect(404);
      expect(response.body.message).toBe("Article not found");
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("201: returns correct article with updated votes", async () => {
      const userComment = {
        username: "butter_bridge",
        body: "Hello! Hope you're having a good day",
      };
      const res = await request(app)
        .post("/api/articles/1/comments")
        .send(userComment)
        .expect(201);
      expect(res.body.comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          article_id: 1,
          author: "butter_bridge",
          body: "Hello! Hope you're having a good day",
          votes: 0,
          created_at: expect.any(String),
        }),
      );
    });
    test("200: responds with correct array of comment objects when given a valid article_id", async () => {
      const userComment = {
        username: "butter_bridge",
        body: "Hello! Hope you're having a good day",
      };
      const { body } = await request(app)
        .get("/api/articles/5/comments")
        .send(userComment)
        .expect(200);
      expect(body.comments).toEqual([
        {
          comment_id: 14,
          body: "What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.",
          article_id: 5,
          author: "icellusedkars",
          votes: 16,
          created_at: "2020-06-09T05:00:00.000Z",
        },
        {
          comment_id: 15,
          body: "I am 100% sure that we're not completely sure.",
          article_id: 5,
          author: "butter_bridge",
          votes: 1,
          created_at: "2020-11-24T00:08:00.000Z",
        },
      ]);
      expect(body.comments.length).toBe(2);
    });
    test("400: responds with the correct error message when passed an invalid article_id", async () => {
      const response = await request(app)
        .post("/api/articles/wrongwrongwrong/comments")
        .expect(400)
        .send({
          username: "butter_bridge",
          body: "Hello! Hope you're having a good day",
        });
      expect(response.body.message).toBe("Invalid input.");
    });
    test("404: responds with the correct error message when passed a valid but non-existent article_id", async () => {
      const userComment = {
        username: "butter_bridge",
        body: "Hello! Hope you're having a good day",
      };
      const response = await request(app)
        .post("/api/articles/11111/comments")
        .send(userComment)

        .expect(404);
      expect(response.body.message).toBe("Article not found.");
    });
    test("404: responds with the correct error message when passed an invalid username", async () => {
      const userComment = {
        username: "otis",
        body: "Hello! Hope you're having a good day",
      };
      const response = await request(app)
        .post("/api/articles/1/comments")
        .send(userComment)

        .expect(404);
      expect(response.body.message).toBe("Username not found.");
    });
  });

  describe("PATCH /api/:article_id/", () => {
    test("200: responds with the correct article object along with its updated votes ", async () => {
      const articleBeforeUpdate = await request(app).get("/api/articles/1");

      const votesBeforeUpdate = articleBeforeUpdate.body.article.votes;
      const updatedArticle = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200);

      expect(updatedArticle.body.article).toEqual({
        article_id: 1,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        title: "Living in the shadow of a great man",
        topic: "mitch",
        votes: 101,
      });
      const updatedVotes = updatedArticle.body.article.votes;
      expect(updatedVotes).toBe(votesBeforeUpdate + 1);
    });
    test("400: responds with correct error when inc_votes is missing", async () => {
      const response = await request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400);
      expect(response.body.message).toBe("inc_votes is required");
    });
    test("400: responds with correct error when passed inc_votes isn't a number", async () => {
      const response = await request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "oops" })
        .expect(400);
      expect(response.body.message).toBe("Invalid inc_votes");
    });
    test("400: responds with correct error when article_id is invalid", async () => {
      const response = await request(app)
        .patch("/api/articles/oops")
        .send({ inc_votes: 1 })
        .expect(400);
      expect(response.body.message).toBe("Invalid article id");
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("204 - returns correct error code when comment_id is valid", async () => {
      await request(app).delete("/api/comments/1").expect(204);
    });
    test("204 - correctly removes comment when comment_id is valid", async () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(async () => {
          const { body } = await request(app)
            .delete("/api/comments/1")
            .expect(404);
          expect(body.message).toBe("Comment not found");
        });
    });
    test("404 - returns correct error message when a comment id does not exist", async () => {
      const { body } = await request(app)
        .delete("/api/comments/111")
        .expect(404);
      expect(body.message).toBe("Comment not found");
    });
    test("404 - returns correct error message when a comment id does not exist", async () => {
      const { body } = await request(app)
        .delete("/api/comments/wrongwrongwrong")
        .expect(400);
      expect(body.message).toBe("Invalid commment id");
    });
  });
});
