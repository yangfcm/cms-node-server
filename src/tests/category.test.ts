import request from 'supertest'
import app from '../app';
import { techCategory, hobbyCategory } from './fixtures/category';
import { CATEGORY } from '../settings/constants';

describe("Test category routers", () => {
  const { mikeBlog1Address, userMikeToken } = globalThis.__TESTDATA__;
  test("User should be able to get the categories under a particular blog", async () => {
    const {
      body: { categories }
    } = await request(app).get(`/api/blogs/${mikeBlog1Address}/categories`);
    expect(categories.length).toBe(2);

    const foundTechCategory = categories.find((c: any) => c.name === techCategory.name);
    expect(foundTechCategory).toMatchObject(techCategory);

    const foundHobbyCategory = categories.find((c: any) => c.name === hobbyCategory.name);
    expect(foundHobbyCategory).toMatchObject(hobbyCategory);
  });

  test("Should not create a category with the existing name", async () => {
    const newCategory = {
      name: 'Hobby',
      description: 'Another hobby category?',
    };
    const {
      body, status
    } = await request(app)
      .post(`/api/blogs/${mikeBlog1Address}/categories`)
      .set('x-auth', userMikeToken)
      .send({
        category: newCategory,
      });
    expect(status).toBe(400);
    expect(body.message).toMatch(CATEGORY.NAME_IN_USE);
  });

  test.todo("Blog owner should be able to create a category");
  test.todo("Should not update a category to an existing name");
  test.todo("Blog owner should be able to update a category");
  test.todo("Blog owner should be able to delete a category");
});