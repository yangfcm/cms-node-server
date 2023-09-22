import request from "supertest";
import app from "../app";
import { ArticleStatus } from "../models/article";

describe("Test article routers", () => {
  const {
    newArticleInMikeBlog1,
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
        title: newArticleInMikeBlog1.title,
        content: newArticleInMikeBlog1.content,
        status: newArticleInMikeBlog1.status,
        isTop: newArticleInMikeBlog1.isTop,
      });
    });
  });
});
