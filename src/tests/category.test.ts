import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { readCategoryById } from "../repositories/category";
import { BLOG, CATEGORY } from "../settings/constants";

describe("Test category routers", () => {
  const {
    mikeBlog1,
    mikeBlog2,
    userMikeToken,
    userJohnToken,
    hobbyCategoryInMikeBlog1,
    techCategoryInMikeBlog1,
    operationCategoryInMikeBlog2,
    devCategoryInMikeBlog2,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;
  const { address: mikeBlog2Address } = mikeBlog2;
  const randomId = new mongoose.Types.ObjectId();

  describe("GET /blogs/:address/categories", () => {
    test("Should get the categories under a particular blog", async () => {
      const {
        body: { categories },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/categories`);
      expect(categories.length).toBe(2);

      const foundTechCategory = categories.find(
        (c: any) => c.name === techCategoryInMikeBlog1.name
      );
      expect(foundTechCategory).toMatchObject(techCategoryInMikeBlog1);

      const foundHobbyCategory = categories.find(
        (c: any) => c.name === hobbyCategoryInMikeBlog1.name
      );
      expect(foundHobbyCategory).toMatchObject(hobbyCategoryInMikeBlog1);
    });

    test("Should get blog not found error message if blog address is not found.", async () => {
      const {
        body: { message },
        status,
      } = await request(app).get("/api/blogs/non-exist-blog/categories");
      expect(status).toBe(404);
      expect(message).toBe(BLOG.NOT_FOUND);
    });
  });

  describe("GET /blogs/:address/categories/:categoryId", () => {
    test("Should get the category by id.", async () => {
      const {
        body: { category },
      } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/categories/${hobbyCategoryInMikeBlog1.id}`
      );
      expect(category).toMatchObject(hobbyCategoryInMikeBlog1);
    });

    test("Should get category not found error if category id doesn't exist", async () => {
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog1Address}/categories/${randomId}`
      );
      expect(status).toBe(404);
    });

    test("Should get not found error if category id exists but in another blog", async () => {
      const { status } = await request(app).get(
        `/api/blogs/${mikeBlog2Address}/categories/${hobbyCategoryInMikeBlog1.id}`
      );
      expect(status).toBe(404);
    });
  });

  describe("POST /blogs/:address/categories", () => {
    test("Should not create a category with the existing name", async () => {
      const newCategory = {
        name: hobbyCategoryInMikeBlog1.name,
        description: "The category with the same name of 'Hobby'",
      };
      const { body, status } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/categories`)
        .set("x-auth", userMikeToken)
        .send({
          category: newCategory,
        });
      expect(status).toBe(400);
      expect(body.message).toContain(CATEGORY.NAME_IN_USE);
    });

    test("Should not create a category for the blog you do not own", async () => {
      const newCategory = { name: "Play" };
      const { body, status } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/categories`)
        .set("x-auth", userJohnToken)
        .send({
          category: newCategory,
        });
      expect(status).toBe(403);
      expect(body.message).toContain(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Blog owner should be able to create a category", async () => {
      const newCategory = {
        name: "Hobby - 1",
        description: "Another hobby category!",
      };
      const { body } = await request(app)
        .post(`/api/blogs/${mikeBlog1Address}/categories`)
        .set("x-auth", userMikeToken)
        .send({
          category: newCategory,
        });
      expect(body.category).toMatchObject(newCategory);
    });
  });

  describe("PUT /blogs/:address/categories/:categoryId", () => {
    test("Should not update a category to an existing name", async () => {
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/categories/${operationCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: devCategoryInMikeBlog2.name, // Change the name to dev category's name, which exists.
          },
        });
      expect(status).toBe(400);
      expect(body.message).toMatch(CATEGORY.NAME_IN_USE);
    });

    test("Should not be able to update a category that user does not own", async () => {
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/categories/${operationCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userJohnToken)
        .send({
          category: {
            description: "A bit more",
          },
        });
      expect(status).toBe(403);
      expect(body.message).toMatch(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Should get not found error if category id does not exist", async () => {
      const { status } = await request(app)
        .put(`/api/blogs/${mikeBlog2Address}/categories/${randomId}`)
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: "New",
          },
        });
      expect(status).toBe(404);
    });

    test("Should get not found error if category id exists but in another blog", async () => {
      const { status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/categories/${operationCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: "New",
          },
        });
      expect(status).toBe(404);
    });

    test("Blog owner should be able to update a category", async () => {
      const { body } = await request(app)
        .put(
          `/api/blogs/${mikeBlog2Address}/categories/${operationCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            description: "Updated description",
          },
        });
      expect(body.category).toMatchObject({
        id: operationCategoryInMikeBlog2.id,
        name: operationCategoryInMikeBlog2.name,
        description: "Updated description",
      });
    });
  });

  describe("DELETE /blogs/:address/categories/:categoryId", () => {
    test("Should get not found error if category id does not exist", async () => {
      const { status } = await request(app)
        .delete(`/api/blogs/${mikeBlog2Address}/categories/${randomId}`)
        .set("x-auth", userMikeToken);
      expect(status).toBe(404);
    });

    test("Should get not found error if category id exists but in another blog", async () => {
      const { status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/categories/${devCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken);
      expect(status).toBe(404);
    });

    test("Should not be able to delete a category that user does not own", async () => {
      const { body, status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog2Address}/categories/${devCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userJohnToken);
      expect(status).toBe(403);
      expect(body.message).toMatch(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Should not be able to delete a category if it's referenced by articles", async () => {
      const { body, status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/categories/${techCategoryInMikeBlog1.id}`
        )
        .set("x-auth", userMikeToken);
      expect(status).toBe(400);
      expect(body.message).toMatch(CATEGORY.REFERENCED_BY_ARTICLE);
    });

    test("Blog owner should be able to delete a category", async () => {
      const { body } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog2Address}/categories/${devCategoryInMikeBlog2.id}`
        )
        .set("x-auth", userMikeToken);
      expect(body.category).toMatchObject({
        id: devCategoryInMikeBlog2.id,
        name: devCategoryInMikeBlog2.name,
        description: devCategoryInMikeBlog2.description,
      });

      const deleted = await readCategoryById(devCategoryInMikeBlog2.id);
      expect(deleted).toBeNull();
    });
  });
});
