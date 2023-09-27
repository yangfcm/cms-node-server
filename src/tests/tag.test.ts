import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { BLOG, TAG } from "../settings/constants";

describe("Test tag routers", () => {
  const {
    mikeBlog1,
    mikeBlog2,
    userMikeToken,
    userJohnToken,
    ideaTagInMikeBlog1,
    techTagInMikeBlog1,
    lifeTagInMikeBlog1,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;
  const { address: mikeBlog2Address } = mikeBlog2;

  describe("GET /blogs/:address/tags", () => {
    test("should get the tags under a particular blog", async () => {
      const {
        body: { tags },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/tags`);
      expect(tags.length).toBe(3);
      expect(tags[0]).toMatchObject(ideaTagInMikeBlog1);
      expect(tags[1]).toMatchObject(techTagInMikeBlog1);
      expect(tags[2]).toMatchObject(lifeTagInMikeBlog1);
    });

    test("Should get blog not found error if blog address is not found", async () => {
      const {
        body: { message },
        status,
      } = await request(app).get("/api/blogs/non-exist-blog/tags");
      expect(status).toBe(404);
      expect(message).toBe(BLOG.NOT_FOUND);
    });
  });

  describe("GET /blogs/:address/tags/:tagId", () => {
    test("Should get the blog by id", async () => {
      const {
        body: { tag },
      } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/tags/${techTagInMikeBlog1.id}`
      );
      expect(tag).toMatchObject(techTagInMikeBlog1);
    });

    test("Should get tag not found error if tag id doesn't exist", async () => {
      const randomId = new mongoose.Types.ObjectId();
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/tags/${randomId}`
      );
      expect(status).toBe(404);
    });

    test("Should get not found error if tag id exists but in another blog", async () => {
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog2Address}/tags/${techTagInMikeBlog1.id}`
      );
      expect(status).toBe(404);
    });
  });

  describe("POST /blogs/:address/tags", () => {
    test("should not create a tag with the existing name", async () => {
      const newTag = {
        name: ideaTagInMikeBlog1.name,
      };
      const { body, status } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/tags`)
        .set("x-auth", userMikeToken)
        .send({
          tag: newTag,
        });
      expect(status).toBe(400);
      expect(body.message).toContain(TAG.NAME_IN_USE);
    });

    test("Should not create a tag for the blog you do not own", async () => {
      const newTag = {
        name: "new tag",
      };
      const { body, status } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/tags`)
        .set("x-auth", userJohnToken)
        .send({
          tag: newTag,
        });
      expect(status).toBe(403);
      expect(body.message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("blog owner should create a tag", async () => {
      const newTag = {
        name: "new tag",
      };
      const {
        body: { tag },
      } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/tags`)
        .set("x-auth", userMikeToken)
        .send({
          tag: newTag,
        });
      expect(tag).toMatchObject(newTag);
    });
  });

  describe("PUT /blogs/:address/tags/:tagId", () => {
    test.todo("Should get not found error if tag id does not exist");
    test.todo(
      "Should get not found error if tag id exists but in another blog"
    );
    test.todo("should not update a tag to an existing name");
    test.todo("should not update a tag that user does not own");
    test.todo("blog owner should update a tag");
  });

  describe("DELETE /blogs/:address/tags/:tagId", () => {
    test.todo("should not delete a tag that user does not own");
    test.todo("blog owner should delete a tag");
  });
});
