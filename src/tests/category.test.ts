import request from 'supertest'
import app from '../app';
import { techCategory, hobbyCategory } from './fixtures/category';

describe("Test category routers", () => {
  test("User should be able to get the categories under a particular blog", async () => {
    const { mikeBlog1Address } = globalThis.__TESTDATA__;
    const {
      body: { categories }
    } = await request(app).get(`/api/blogs/${mikeBlog1Address}/categories`);
    expect(categories.length).toBe(2);

    const foundTechCategory = categories.find((c: any) => c.name === techCategory.name);
    expect(foundTechCategory).toMatchObject(techCategory);

    const foundHobbyCategory = categories.find((c: any) => c.name === hobbyCategory.name);
    expect(foundHobbyCategory).toMatchObject(hobbyCategory);
  });
});