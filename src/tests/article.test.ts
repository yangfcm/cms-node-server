import request from "supertest";
import app from "../app";
import { ArticleStatus } from "../models/article";

describe("Test article routers", () => {
  const {
    articleInMikeBlog1,
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

      // console.log("==================", articles);
      expect(articles.length).toBe(1);
      expect(articles[0]).toMatchObject({
        title: articleInMikeBlog1.title,
        content: articleInMikeBlog1.content,
        status: articleInMikeBlog1.status,
        isTop: articleInMikeBlog1.isTop,
      });
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
