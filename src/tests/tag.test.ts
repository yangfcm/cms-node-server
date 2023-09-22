import request from "supertest";
import app from "../app";
import { TAG } from "../settings/constants";

describe("Test tag routers", () => {
  const {
    mikeBlog1,
    userMikeToken,
    ideaTagInMikeBlog1,
    techTagInMikeBlog1,
    lifeTagInMikeBlog1,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;

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
    test.todo("should not update a tag to an existing name");
    test.todo("should not update a tag that user does not own");
    test.todo("blog owner should update a tag");
  });

  describe("DELETE /blogs/:address/tags/:tagId", () => {
    test.todo("should not delete a tag that user does not own");
    test.todo("blog owner should delete a tag");
  });
});
