import { ArticlePostData, ArticleNewData, ArticleData } from "../dtos/article";
import Article from "../models/article";

/**
 * Create an article
 * @param article
 * @returns Created article
 */
export const createArticle = async (
  article: ArticleNewData
): Promise<ArticleData> => {
  const newArticle = new Article(article);
  await newArticle.save();
  await Article.populate(newArticle, [
    { path: "blogId", select: "_id title address" },
    { path: "userId", select: "_id username nickname biography avatar" },
    {
      path: "categoryId",
      select: "_id name description",
    },
    {
      path: "tagIds",
      select: "_id, name",
    },
  ]);
  return newArticle.mapToArticleData();
};

/**
 * Get all articles in a blog.
 * If blogId not provided, get all articles
 * @param blogId
 * @returns All articles in the blog.
 */
export const readArticles = async (blogId?: string): Promise<ArticleData[]> => {
  const filter: { blogId?: string } = {};
  if (blogId) filter.blogId = blogId;
  const articles = await Article.find(filter)
    .populate("blogId", "_id title address")
    .populate("userId", "_id username nickname biography avatar")
    .populate("categoryId", "_id name description")
    .populate("tagIds", "_id name");
  return (articles || []).map((a) => a.mapToArticleData());
};

/**
 * Get an article by id
 * If blogId is provided, get the article by id in this blog only.
 * @param id
 * @param blogId
 * @returns The article found or null if not found.
 */
export const readArticleById = async (
  id: string,
  blogId?: string
): Promise<ArticleData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const article = await Article.findOne(filter)
    .populate("blogId", "_id title address")
    .populate("userId", "_id email username nickname biography")
    .populate("categoryId", "_id name description")
    .populate("tagIds", "_id name");
  return article?.mapToArticleData() || null;
};

/**
 * Update an article by id.
 * If blogId provided, it restricts to updating the article under the blog.
 * @param id
 * @param article
 * @param blogId
 * @returns Updated article or null if article doesn't exist.
 */
export const updateArticle = async (
  id: string,
  article: Partial<ArticlePostData>,
  blogId?: string
): Promise<ArticleData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const updatedArticle = await Article.findOneAndUpdate(
    filter,
    {
      $set: article,
    },
    { runValidators: true, returnDocument: "after" }
  )
    .populate("blogId", "_id title address")
    .populate("userId", "_id email username nickname biography")
    .populate("categoryId", "_id name description")
    .populate("tagIds", "_id name");
  return updatedArticle?.mapToArticleData() || null;
};

/**
 * Delete an article by id
 * If blodId exists, it restricts to deleting the article with the id under the blog.
 * @param id
 * @param blogId
 * @returns The deleted article or null if article doesn't exist.
 */
export const deleteArticle = async (
  id: string,
  blogId?: string
): Promise<ArticleData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const article = await Article.findOneAndDelete(filter)
    .populate("blogId", "_id title address")
    .populate("userId", "_id email username nickname biography")
    .populate("categoryId", "_id name description")
    .populate("tagIds", "_id name");
  return article?.mapToArticleData() || null;
};

/**
 * Get how many articles are under a category.
 * @param id
 * @param blogId
 * @returns The number of articles under a category.
 */
export const countArticlesBycategoryId = async (
  categoryId: string,
  blogId?: string
): Promise<number> => {
  const filter: { categoryId: string; blogId?: string } = { categoryId };
  if (blogId) filter.blogId = blogId;
  const count = await Article.countDocuments(filter);
  return count;
};
