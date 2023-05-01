import request from "supertest";
import app from "../app";
import { readUserById } from "../repositories/user";
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

  // test("User updates a blog", async() => {
  //   const { userMikeId, userMikeToken } = globalThis.__TESTDATA__;
  //   const {
  //     body: { user }
  //   }

  //   const { 
  //     body: { blog: updatedBlog },
  //   } = await request(app).put(`/api/blogs/${}`)

  // });

  // test("User delete a blog", async() => {

  // });
});
