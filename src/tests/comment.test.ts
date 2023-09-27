import request from "supertest";
import mongoose from "mongoose";
import app from "../app";

describe("Test comment routers", () => {
  const {
    comment1ForArticle1,
    comment2ForArticle1,
    comment1ForArticle3,
    comment2ForArticle3,
    article1InMikeBlog1,
    article2InMikeBlog1,
    mikeBlog1,
    mikeBlog2,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;
  const { address: mikeBlog2Address } = mikeBlog2;

  describe("GET /blogs/:address/comments", () => {
    test("should get comments for a particular blog", async () => {
      const {
        body: { comments },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/comments`);
      expect(comments.length).toBe(2);
      expect(comments[0]).toMatchObject(comment1ForArticle1);
      expect(comments[1]).toMatchObject(comment2ForArticle1);
    });
    test("should get comments for an article (article1)", async () => {
      const {
        body: { comments },
      } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/comments?articleId=${article1InMikeBlog1.id}`
      );
      expect(comments.length).toBe(2);
      expect(comments[0]).toMatchObject(comment1ForArticle1);
      expect(comments[1]).toMatchObject(comment2ForArticle1);
    });
    test("should get comments for an article (article2)", async () => {
      const {
        body: { comments },
      } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/comments?articleId=${article2InMikeBlog1.id}`
      );
      expect(comments.length).toBe(0);
    });

    test("should get no comments for an article in another blog", async () => {
      const {
        body: { comments },
      } = await request(app).get(
        `/api/blogs/${mikeBlog2Address}/comments?articleId=${article1InMikeBlog1.id}`
      );
      expect(comments.length).toBe(0);
    });
  });

  describe("GET /blogs/:address/comments/:commentId", () => {
    test.todo("should not get comment if it does not exist");
    test.todo("should not get comment if it exists but in another blog");
    test.todo("should get comment by id");
  });

  describe("POST /blogs/:address/comments", () => {
    test.todo("should be able to create a comment");
  });

  describe("PUT /blogs/:address/comments/:commentId", () => {
    test.todo("should not update a comment that does not exist");
    test.todo("should not update a comment that exists but in another blog");
    test.todo("should not update a comment in a blog that user does not own");
    test.todo("should update a comment's content");
    test.todo("should update a comment's status and isTop");
  });

  describe("DELETE /blogs/:address/comments/:commentId", () => {
    test.todo("should not delete a comment that does not exist");
    test.todo("should not delete a comment that exists but in another blog");
    test.todo("should not delete a comment in a blog that user does not own");
    test.todo("blog owner should delete a comment");
  });
});
