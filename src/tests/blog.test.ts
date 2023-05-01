import request from "supertest";
import app from "../app";
import { readUserById } from "../repositories/user";
import { readBlog } from "../repositories/blog";
import { johnBlog } from "./fixtures/blog";

describe("Test blog routers", () => {
  test("User creates a blog", async () => {
    const { userJohnToken, userJohnId } = globalThis.__TESTDATA__;

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
    expect(createdBlog.userId).toBe(userJohnId);

    const userJohn = await readUserById(userJohnId);
    expect(userJohn?.blogs).toBeDefined();
    expect((userJohn?.blogs || [])[0].id).toBe(createdBlog.id);
  });

  test("User updates a blog", async () => {
    const { userJohnToken } = globalThis.__TESTDATA__;

    const { body: { user } } = await request(app).get('/api/auth/token')
      .set("x-auth", userJohnToken);
    const blogToUpdate = user.blogs[0]; // I'm going to test to update the blog created by John in the test above.

    const {
      body: { blog: updatedBlog },
    } = await request(app)
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('x-auth', userJohnToken)
      .send({ blog: { title: 'new blog', address: 'new-blog' } });
    expect(updatedBlog).toMatchObject({
      id: blogToUpdate.id as string,
      title: 'new blog',
      address: 'new-blog'
    });
  });

  test("User delete a blog", async () => {
    const { userJohnToken } = globalThis.__TESTDATA__;

    const { body: { user } } = await request(app).get('/api/auth/token')
      .set("x-auth", userJohnToken);
    const blogToDelete = user.blogs[0]; // I'm going to test to delete the blog created by John in the test above.
    const {
      body: { blog: deletedBlog }
    } = await request(app)
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('x-auth', userJohnToken);
    expect(deletedBlog).toMatchObject({
      id: blogToDelete.id,
      title: 'new blog',
      address: 'new-blog',
    });

    const oldBlog = await readBlog(blogToDelete.id);
    expect(oldBlog).toBeNull();
  });
});
