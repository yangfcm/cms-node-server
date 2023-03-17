import request from "supertest";
import app from "../app";
import { johnBlog } from "./fixtures/blog";

describe("Test blog routers", () => {
  test("User creates a blog", async () => {
    const { userJohnToken } = globalThis.__TESTDATA__;

    const {
      body: { blog: createdBlog },
    } = await request(app)
      .post("/api/blogs")
      .set("x-auth", userJohnToken)
      .send({
        blog: johnBlog,
      });

    expect(createdBlog).toBeDefined();
  });
});
