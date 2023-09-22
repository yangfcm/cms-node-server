import request from "supertest";
import app from "../app";

describe("Test article routers", () => {
  const { newArticleInMikeBlog1, mikeBlog1, hobbyCategoryInMikeBlog1 } =
    globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;

  describe("GET /blogs/:address/articles", () => {
    test("should get the articles under a particular blog", async () => {
      const {
        body: { articles },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/articles`);

      // console.log(hobbyCategoryInMikeBlog1);
      // console.log("==================", articles);
      expect(articles.length).toBe(1);
    });
  });
});
