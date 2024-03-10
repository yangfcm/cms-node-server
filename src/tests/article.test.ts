import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { ArticleStatus } from "../models/article";
import { BLOG } from "../settings/constants";

describe("Test article routers", () => {
  const {
    article1InMikeBlog1,
    article2InMikeBlog1,
    article3InMikeBlog2,
    mikeBlog1,
    mikeBlog2,
    techCategoryInMikeBlog1,
    ideaTagInMikeBlog1,
    lifeTagInMikeBlog1,
    userMike,
    userMikeToken,
    userJohnToken,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;
  const { address: mikeBlog2Address } = mikeBlog2;
  const randomId = new mongoose.Types.ObjectId();

  describe("GET /blogs/:address/articles", () => {
    test("should get the articles under a particular blog", async () => {
      const {
        body: { articles },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/articles`);

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
      expect(ideaTagInMikeBlog1).toMatchObject(articles[0].tags[0]);
      expect(lifeTagInMikeBlog1).toMatchObject(articles[0].tags[1]);

      expect(articles[1]).toMatchObject({
        id: article2InMikeBlog1.id,
        title: article2InMikeBlog1.title,
        content: article2InMikeBlog1.content,
        status: article2InMikeBlog1.status,
        isTop: article2InMikeBlog1.isTop,
      });
      expect(mikeBlog1).toMatchObject(articles[1].blog);
      expect(techCategoryInMikeBlog1).toMatchObject(articles[1].category);
      expect(userMike).toMatchObject(articles[1].user);
      expect(articles[1].tags.length).toBe(0);
    });
  });

  describe("GET /blogs/:address/articles/:articleId", () => {
    test("should not get the article if id does not.", async () => {
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/articles/${randomId}`
      );
      expect(status).toBe(404);
    });
    test("should not get article if id exists but in another blog.", async () => {
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog2Address}/articles/${article1InMikeBlog1.id}`
      );
      expect(status).toBe(404);
    });
    test("should get the article by id", async () => {
      const {
        body: { article },
      } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/articles/${article2InMikeBlog1.id}`
      );

      expect(article).toMatchObject({
        id: article2InMikeBlog1.id,
        title: article2InMikeBlog1.title,
        content: article2InMikeBlog1.content,
        status: article2InMikeBlog1.status,
        isTop: article2InMikeBlog1.isTop,
      });
      expect(mikeBlog1).toMatchObject(article.blog);
      expect(techCategoryInMikeBlog1).toMatchObject(article.category);
      expect(userMike).toMatchObject(article.user);
      expect(article.tags.length).toBe(0);
    });
  });

  describe("POST /blogs/:address/articles", () => {
    test("should not create an article for a blog user does not own", async () => {
      const { body, status } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/articles`)
        .set("x-auth", userJohnToken)
        .send({
          article: {
            title: "new article from another user",
          },
        });
      expect(status).toBe(403);
      expect(body.message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });
    test("blog owner should create an article", async () => {
      const newArticle = {
        title: "A brand new article",
        content: "Here is my new ideas.",
        categoryId: techCategoryInMikeBlog1.id,
        tagIds: [ideaTagInMikeBlog1.id, lifeTagInMikeBlog1.id],
      };
      const expectedNewArticle = {
        title: newArticle.title,
        content: newArticle.content,
        category: {
          id: techCategoryInMikeBlog1.id,
          name: techCategoryInMikeBlog1.name,
          description: techCategoryInMikeBlog1.description,
        },
        tags: [
          {
            id: ideaTagInMikeBlog1.id,
            name: ideaTagInMikeBlog1.name,
          },
          {
            id: lifeTagInMikeBlog1.id,
            name: lifeTagInMikeBlog1.name,
          },
        ],
      };
      const { body } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/articles`)
        .set("x-auth", userMikeToken)
        .send({ article: newArticle });
      expect(body.article).toMatchObject(expectedNewArticle);
    });
  });

  describe("PUT /blogs/:address/articles/:articleId", () => {
    test("should not update an article that does not exist", async () => {
      const { status } = await request(app)
        .put(`/api/blogs/${mikeBlog2Address}/articles/${randomId}`)
        .set("x-auth", userMikeToken)
        .send({
          article: {
            content: "something new.",
          },
        });
      expect(status).toBe(404);
    });
    test("should not update an article that exists but in another blog", async () => {
      const { status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          article: {
            content: "something new.",
          },
        });
      expect(status).toBe(404);
    });
    test("should not update an article that user does not own", async () => {
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userJohnToken)
        .send({
          article: {
            content: "something new.",
          },
        });
      expect(status).toBe(403);
      expect(body.message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });
    test("should update an article's title and content", async () => {
      const newArticle = {
        title: "new title",
        content: "new content",
      };
      const {
        body: { article },
      } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          article: newArticle,
        });
      expect(article.id).toBe(article3InMikeBlog2.id);
      expect(article.title).toBe(newArticle.title);
      expect(article.content).toBe(newArticle.content);
    });
    test("should update article's metadata: status, isTop", async () => {
      const {
        body: { article },
      } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          article: {
            status: ArticleStatus.PUBLISHED,
            isTop: true,
          },
        });
      expect(article.id).toBe(article3InMikeBlog2.id);
      expect(article.status).toBe(ArticleStatus.PUBLISHED);
      expect(article.isTop).toBe(true);
    });
  });

  describe("DELETE /blogs/:address/articles/:articleId", () => {
    test("Should get not found error if article id does not exist", async () => {
      const { status } = await request(app)
        .delete(`/api/blogs/${mikeBlog2Address}/articles/${randomId}`)
        .set("x-auth", userMikeToken);
      expect(status).toBe(404);
    });

    test("Should get not found error if article id exists but in another blog", async () => {
      const { status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken);
      expect(status).toBe(404);
    });

    test("Should not be able to delete an article that user does not own", async () => {
      const { body, status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog2Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userJohnToken);
      expect(status).toBe(403);
      expect(body.message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Blog owner should be able to delete an article", async () => {
      const {
        status,
        body: { article },
      } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog2Address}/articles/${article3InMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken);
      expect(article.id).toBe(article3InMikeBlog2.id);
      expect(status).toBe(200);
    });
  });
});
