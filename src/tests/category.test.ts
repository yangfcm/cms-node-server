import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { findCategoryByName } from "../repositories/category";
import { BLOG, CATEGORY } from "../settings/constants";

describe("Test category routers", () => {
  const {
    mikeBlog1,
    mikeBlog2,
    userMikeToken,
    userJohnToken,
    hobbyCategoryInMikeBlog1,
    techCategoryInMikeBlog1,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;
  const { address: mikeBlog2Address } = mikeBlog2;

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
      const randomId = new mongoose.Types.ObjectId();
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
      const categoryToUpdate = await findCategoryByName(
        hobbyCategoryInMikeBlog1.name
      );
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToUpdate?.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: techCategoryInMikeBlog1.name, // Change the name to tech category's name, which exists.
          },
        });
      expect(status).toBe(400);
      expect(body.message).toMatch(CATEGORY.NAME_IN_USE);
    });

    test("Should not be able to update a category that user does not own", async () => {
      const categoryToUpdate = await findCategoryByName(
        hobbyCategoryInMikeBlog1.name
      );
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToUpdate?.id}`
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

    test("Blog owner should be able to update a category", async () => {
      const categoryToUpdate = await findCategoryByName(
        hobbyCategoryInMikeBlog1.name
      );
      const { body } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToUpdate?.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: categoryToUpdate?.name,
            description: "I love music and dancing.",
          },
        });
      expect(body.category).toMatchObject({
        id: categoryToUpdate?.id,
        name: categoryToUpdate?.name,
        description: "I love music and dancing.",
      });
    });
  });

  describe("DELETE /blogs/:address/categories/:categoryId", () => {
    test("Should not be able to delete a category that user does not own", async () => {
      const categoryToDelete = await findCategoryByName(
        hobbyCategoryInMikeBlog1.name
      );
      const { body, status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToDelete?.id}`
        )
        .set("x-auth", userJohnToken);
      expect(status).toBe(403);
      expect(body.message).toMatch(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Blog owner should be able to delete a category", async () => {
      const categoryToDelete = await findCategoryByName(
        hobbyCategoryInMikeBlog1.name
      );
      const { body } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToDelete?.id}`
        )
        .set("x-auth", userMikeToken);
      expect(body.category).toMatchObject({
        id: categoryToDelete?.id,
        name: categoryToDelete?.name,
        description: categoryToDelete?.description,
      });

      const deleted = await findCategoryByName(hobbyCategoryInMikeBlog1.name);
      expect(deleted).toBeNull();
    });
  });
});
