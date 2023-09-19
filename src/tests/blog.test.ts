import request from "supertest";
import app from "../app";
import { readUserById } from "../repositories/user";
import { readBlog } from "../repositories/blog";
import { johnBlog } from "./fixtures/blog";
import { BLOG } from "../settings/constants";

describe("Test blog routers", () => {
  describe("POST /blogs", () => {
    test("User creates a blog", async () => {
      const { userJohnToken, userJohn } = globalThis.__TESTDATA__;

      const {
        body: { blog: createdBlog },
      } = await request(app)
        .post("/api/blogs")
        .set("x-auth", userJohnToken)
        .send({
          blog: johnBlog,
        });

      expect(createdBlog.id).toBeDefined();
      expect(createdBlog.title).toBe(johnBlog.title);
      expect(createdBlog.address).toBe(johnBlog.address);
      expect(createdBlog.userId).toBe(userJohn.id);

      const currentUserJohn = await readUserById(userJohn.id);
      expect(currentUserJohn?.blogs).toBeDefined();
      expect((currentUserJohn?.blogs || [])[0].id).toBe(createdBlog.id);
    });

    test("Post blog with empty title or existing address", async () => {
      const { userJohnToken, userJohn } = globalThis.__TESTDATA__;

      const { body: error, status } = await request(app)
        .post("/api/blogs")
        .set("x-auth", userJohnToken)
        .send({
          blog: {
            title: "",
            userId: userJohn.id,
          },
        });

      expect(status).toBe(400);
      expect(error.message).toMatch(BLOG.ADDRESS_REQUIRED);
      expect(error.message).toMatch(BLOG.TITLE_REQUIRED);
    });

    test("User creates a blog with existing address", async () => {
      const { userMikeToken, userMike, mikeBlog1 } = globalThis.__TESTDATA__;

      const { body: error, status } = await request(app)
        .post("/api/blogs")
        .set("x-auth", userMikeToken)
        .send({
          blog: {
            title: "Mike's new blog",
            address: mikeBlog1.address, // Address is the same with mikeBlog1.address, which is populated when seeding data.
            userId: userMike.id,
          },
        });

      expect(status).toBe(400);
      expect(error.message).toMatch(BLOG.ADDRESS_IN_USE);
    });
  });

  describe("GET /blogs", () => {
    test("User can get the blogs", async () => {
      const { userMikeToken, mikeBlog1, mikeBlog2 } = globalThis.__TESTDATA__;
      const {
        body: { blogs },
      } = await request(app).get("/api/blogs").set("x-auth", userMikeToken);
      expect(blogs[0]).toMatchObject(mikeBlog1);
      expect(blogs[1]).toMatchObject(mikeBlog2);
    });
  });

  describe("GET /blogs/:address", () => {
    test("User can get the blog by address", async () => {
      const { mikeBlog1 } = globalThis.__TESTDATA__;
      const {
        body: { blog },
      } = await request(app).get(`/api/blogs/${mikeBlog1.address}`);
      expect(blog).toEqual(mikeBlog1);
    });

    test("User cannot get blog if the given address is unavailable", async () => {
      const { status } = await request(app).get("/api/blogs/non-exist-address");
      expect(status).toBe(404);
    });
  });

  describe("PUT /blogs/:blogId", () => {
    test("User updates a blog", async () => {
      const { userJohnToken } = globalThis.__TESTDATA__;

      const {
        body: { user },
      } = await request(app)
        .get("/api/auth/token")
        .set("x-auth", userJohnToken);
      const blogToUpdate = user.blogs[0]; // I'm going to test to update the blog created by John in the test above.

      const {
        body: { blog: updatedBlog },
      } = await request(app)
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set("x-auth", userJohnToken)
        .send({ blog: { title: "new blog", address: "new-blog" } });
      expect(updatedBlog).toMatchObject({
        id: blogToUpdate.id as string,
        title: "new blog",
        address: "new-blog",
      });
    });

    test("User cannot update other user's blog", async () => {
      const { userJohnToken, mikeBlog1 } = globalThis.__TESTDATA__;
      const {
        body: { message },
        status,
      } = await request(app)
        .put(`/api/blogs/${mikeBlog1.id}`)
        .set("x-auth", userJohnToken)
        .send({ blog: { title: "Now it's John's blog!" } });
      expect(status).toBe(403);
      expect(message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });
  });

  describe("DELETE /blogs/:blogId", () => {
    test("User delete a blog", async () => {
      const { userJohnToken } = globalThis.__TESTDATA__;

      const {
        body: { user },
      } = await request(app)
        .get("/api/auth/token")
        .set("x-auth", userJohnToken);
      const blogToDelete = user.blogs[0]; // I'm going to test to delete the blog created by John in the test above.
      const {
        body: { blog: deletedBlog },
      } = await request(app)
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("x-auth", userJohnToken);
      expect(deletedBlog).toMatchObject({
        id: blogToDelete.id,
        title: "new blog",
        address: "new-blog",
      });

      const oldBlog = await readBlog(blogToDelete.id);
      expect(oldBlog).toBeNull();
    });

    test("User cannot delete other user's blog", async () => {
      const { userJohnToken, mikeBlog1 } = globalThis.__TESTDATA__;
      const {
        body: { message },
        status,
      } = await request(app)
        .delete(`/api/blogs/${mikeBlog1.id}`)
        .set("x-auth", userJohnToken);
      expect(status).toBe(403);
      expect(message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });
  });
});
