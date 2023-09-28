import { userJohn, userMike } from "./user";
import { mikeBlog1, mikeBlog2 } from "./blog";
import { hobbyCategory, techCategory, devCategory } from "./category";
import { createUser, updateUser } from "../../repositories/user";
import { createBlog } from "../../repositories/blog";
import { createCategory } from "../../repositories/category";
import { createTag } from "../../repositories/tag";
import User from "../../models/user";
import Blog from "../../models/blog";
import Category from "../../models/category";
import Article from "../../models/article";
import Tag from "../../models/tag";
import generateAuthToken from "../../utils/generateAuthToken";
import { createArticle } from "../../repositories/article";
import { ArticleStatus } from "../../models/article";
import { createComment } from "../../repositories/comment";

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
    blogs: [newMikeBlog1.id, newMikeBlog2.id],
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

  // Create categories for blog mikeBlog2 for testing deletion and updating.
  const newDevCategory = await createCategory({
    ...devCategory,
    blogId: newMikeBlog2.id,
  });

  const newOperationCategory = await createCategory({
    name: "Operation",
    description: "Something about operation",
    blogId: newMikeBlog2.id,
  });

  // Create tags for blog mikeBlog1
  const ideaTag = await createTag({
    name: "idea",
    blogId: newMikeBlog1.id,
  });

  const techTag = await createTag({
    name: "tech",
    blogId: newMikeBlog1.id,
  });

  const lifeTag = await createTag({
    name: "life",
    blogId: newMikeBlog1.id,
  });

  // Create tags for blog mikeBlog2 for testing deletion and updating.
  const aiTag = await createTag({
    name: "AI",
    blogId: newMikeBlog2.id,
  });

  const dataTag = await createTag({
    name: "data",
    blogId: newMikeBlog2.id,
  });

  const article1 = await createArticle({
    title: "My first article",
    content: "This is my first article.",
    status: ArticleStatus.DRAFT,
    isTop: false,
    categoryId: newTechCategory.id,
    tagIds: [ideaTag.id, lifeTag.id],
    blogId: newMikeBlog1.id,
    userId: newUserMike.id,
  });

  const article2 = await createArticle({
    title: "My second article",
    content: "This is my second article.",
    status: ArticleStatus.PUBLISHED,
    categoryId: newTechCategory.id,
    tagIds: [],
    blogId: newMikeBlog1.id,
    userId: newUserMike.id,
  });

  const article3 = await createArticle({
    title: "My article for another blog",
    content: "This is my second for another blog - newMikeBlog2",
    status: ArticleStatus.DRAFT,
    categoryId: newDevCategory.id,
    tagIds: [aiTag.id],
    blogId: newMikeBlog2.id,
    userId: newUserMike.id,
  });

  const newComment1ForArticle1 = await createComment({
    content: "my first comment for article 1",
    articleId: article1.id,
    blogId: newMikeBlog1.id,
    userId: newUserMike.id,
  });

  const newComment2ForArticle1 = await createComment({
    content: "my next comment for article 1",
    articleId: article1.id,
    blogId: newMikeBlog1.id,
    userId: newUserMike.id,
  });

  const newComment1ForArticle3 = await createComment({
    content: "new comment for article 3",
    articleId: article3.id,
    blogId: newMikeBlog2.id,
    userId: newUserMike.id,
  });

  const newComment2ForArticle3 = await createComment({
    content: "another comment for article 3",
    articleId: article3.id,
    blogId: newMikeBlog2.id,
    userId: newUserMike.id,
  });

  // Attach user ids and tokens to global so that test cases can read them.
  globalThis.__TESTDATA__ = {
    // Put the seeded data in global variable so that they can be accessed by test cases.
    userJohnToken: generateAuthToken({
      id: newUserJohn.id,
      email: newUserJohn.email,
    }).token,
    userMikeToken: generateAuthToken({
      id: newUserMike.id,
      email: newUserMike.email,
    }).token,
    userMike: newUserMike,
    userJohn: newUserJohn,
    mikeBlog1: newMikeBlog1,
    mikeBlog2: newMikeBlog2,
    hobbyCategoryInMikeBlog1: newHobbyCategory,
    techCategoryInMikeBlog1: newTechCategory,
    operationCategoryInMikeBlog2: newOperationCategory,
    devCategoryInMikeBlog2: newDevCategory,
    ideaTagInMikeBlog1: ideaTag,
    techTagInMikeBlog1: techTag,
    lifeTagInMikeBlog1: lifeTag,
    aiTagInMikeBlog2: aiTag,
    dataTagInMikeBlog2: dataTag,
    article1InMikeBlog1: article1,
    article2InMikeBlog1: article2,
    article3InMikeBlog2: article3,
    comment1ForArticle1: newComment1ForArticle1,
    comment2ForArticle1: newComment2ForArticle1,
    comment1ForArticle3: newComment1ForArticle3,
    comment2ForArticle3: newComment2ForArticle3,
  };
};

export const cleanData = async () => {
  await Article.deleteMany();
  await Tag.deleteMany();
  await Category.deleteMany();
  await Blog.deleteMany();
  await User.deleteMany();
};
