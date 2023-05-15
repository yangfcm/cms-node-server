import { userJohn, userMike } from "./user";
import { mikeBlog1, mikeBlog2 } from "./blog";
import { hobbyCategory, techCategory } from "./category";
import { createUser, updateUser } from "../../repositories/user";
import { createBlog } from "../../repositories/blog";
import { createCategory } from "../../repositories/category";
import User from "../../models/user";
import Blog from "../../models/blog";
import Category from "../../models/category";
import generateAuthToken from "../../utils/generateAuthToken";

/**
 * After seeding data, you will get below test data:
 * Users: Two users - userMike and userJohn and their tokens
 * Blogs: userMike has two blogs - mikeBlog1 and mikeBlog2
 * Categories: Two categories under mikeBlog1 - hobbyCategory and techCategory,
 */
export const seedData = async () => {
  // Create users.
  const newUserJohn = await createUser(userJohn);
  const newUserMike = await createUser(userMike);

  // Attach user ids and tokens to global so that test cases can read them.
  globalThis.__TESTDATA__ = {
    // Put the user token in global variable so that they can be accessed by test cases.
    userJohnId: newUserJohn.id,
    userMikeId: newUserMike.id,
    userJohnToken: generateAuthToken({
      id: newUserJohn.id,
      email: newUserJohn.email,
    }).token,
    userMikeToken: generateAuthToken({
      id: newUserMike.id,
      email: newUserMike.email,
    }).token,
  };

  // Create blogs for user Mike
  const newMikeBlog1 = await createBlog({
    ...mikeBlog1,
    userId: newUserMike.id,
  });
  const newMikeBlog2 = await createBlog({
    ...mikeBlog2,
    userId: newUserMike.id,
  });
  await updateUser(newUserMike.id, {
    blogs: [newMikeBlog1.id, newMikeBlog2.id]
  });

  // Create categories for blog mikeBlog1
  const newHobbyCategory = await createCategory({
    ...hobbyCategory,
    blogId: newMikeBlog1.id,
  });
  const newTechCategory = await createCategory({
    ...techCategory,
    blogId: newMikeBlog1.id,
  });

};

export const cleanData = async () => {
  await Category.deleteMany();
  await Blog.deleteMany();
  await User.deleteMany();
};
