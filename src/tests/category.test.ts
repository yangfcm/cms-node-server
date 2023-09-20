import request from "supertest";
import app from "../app";
import { findCategoryByName } from "../repositories/category";
import { techCategory, hobbyCategory } from "./fixtures/category";
import { BLOG, CATEGORY } from "../settings/constants";

describe("Test category routers", () => {
  const {
    mikeBlog1,
    userMikeToken,
    userJohnToken,
    hobbyCategoryInMikeBlog1,
    techCategoryInMikeBlog1,
  } = globalThis.__TESTDATA__;
  const { address: mikeBlog1Address } = mikeBlog1;

  describe("GET /blogs/:address/categories", () => {
    test("User should be able to get the categories under a particular blog", async () => {
      const {
        body: { categories },
      } = await request(app).get(`/api/blogs/${mikeBlog1Address}/categories`);
      expect(categories.length).toBe(2);

      const foundTechCategory = categories.find(
        (c: any) => c.name === techCategory.name
      );
      expect(foundTechCategory).toMatchObject(techCategoryInMikeBlog1);

      const foundHobbyCategory = categories.find(
        (c: any) => c.name === hobbyCategory.name
      );
      expect(foundHobbyCategory).toMatchObject(hobbyCategoryInMikeBlog1);
    });
  });
  describe("GET /blogs/:address/categories/:categoryId", () => {});

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
      const categoryToUpdate = await findCategoryByName(hobbyCategory.name);
      const { body, status } = await request(app)
        .put(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToUpdate?.id}`
        )
        .set("x-auth", userMikeToken)
        .send({
          category: {
            name: techCategory.name, // Change the name to tech category's name, which exists.
          },
        });
      expect(status).toBe(400);
      expect(body.message).toMatch(CATEGORY.NAME_IN_USE);
    });

    test("Should not be able to update a category that user does not own", async () => {
      const categoryToUpdate = await findCategoryByName(hobbyCategory.name);
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
      const categoryToUpdate = await findCategoryByName(hobbyCategory.name);
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
      const categoryToDelete = await findCategoryByName(hobbyCategory.name);
      const { body, status } = await request(app)
        .delete(
          `/api/blogs/${mikeBlog1Address}/categories/${categoryToDelete?.id}`
        )
        .set("x-auth", userJohnToken);
      expect(status).toBe(403);
      expect(body.message).toMatch(BLOG.NO_ACCESS_TO_BLOG);
    });

    test("Blog owner should be able to delete a category", async () => {
      const categoryToDelete = await findCategoryByName(hobbyCategory.name);
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

      const deleted = await findCategoryByName(hobbyCategory.name);
      expect(deleted).toBeNull();
    });
  });
});
