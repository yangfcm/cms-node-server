import request from "supertest";
import app from "../app";
import { ArticleStatus } from "../models/article";

describe("Test article routers", () => {
  const {
    article1InMikeBlog1,
    article2InMikeBlog2,
    mikeBlog1,
    techCategoryInMikeBlog1,
    ideaTagInMikeBlog1,
    lifeTagInMikeBlog1,
    userMike,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;

  describe("GET /blogs/:address/articles", () => {
    test("should get the articles under a particular blog", async () => {
      const {
        body: { articles },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/articles`);

      console.log("==================", articles);
      expect(articles.length).toBe(2);
      expect(articles[0]).toMatchObject({
        id: article1InMikeBlog1.id,
        title: article1InMikeBlog1.title,
        content: article1InMikeBlog1.content,
        status: article1InMikeBlog1.status,
        isTop: article1InMikeBlog1.isTop,
      });
      expect(mikeBlog1).toMatchObject(articles[0].blog);
      expect(techCategoryInMikeBlog1).toMatchObject(articles[0].category);
      expect(userMike).toMatchObject(articles[0].user);
    });
  });

  describe("GET /blogs/:address/articles/:articleId", () => {
    test.todo("should not get the article if it is unavailable.");
    test.todo("should get the article by id");
  });

  describe("POST /blogs/:address/articles", () => {
    test.todo("blog owner should create an article");
  });

  describe("PUT /blogs/:address/articles/:articleId", () => {
    test.todo("should not update an article that does not exist");
    test.todo("should not update an article that user does not own");
    test.todo("should update an article's title and content");
    test.todo("should update article's metadata: status, isTop");
    test.todo("should update an article's category");
    test.todo("should update an article's tag");
  });
});
