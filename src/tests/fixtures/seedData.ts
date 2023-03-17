import { userJohn, userMike } from "./user";
import { johnBlog, mikeBlog1, mikeBlog2 } from "./blog";
import { createUser } from "../../repositories/user";
import { createBlog } from "../../repositories/blog";
import User from "../../models/user";
import Blog from "../../models/blog";

export const seedData = async () => {
  const newUserJohn = await createUser(userJohn);
  const newUserMike = await createUser(userMike);

  const newJohnBlog = await createBlog({ ...johnBlog, userId: newUserJohn.id });
  const newMikeBlog1 = await createBlog({
    ...mikeBlog1,
    userId: newUserMike.id,
  });
  const newMikeBlog2 = await createBlog({
    ...mikeBlog2,
    userId: newUserMike.id,
  });
};

export const cleanData = async () => {
  await User.deleteMany();
  await Blog.deleteMany();
};
