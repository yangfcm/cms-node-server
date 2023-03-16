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
  return newArticle.mapToArticleData();
};

/**
 * Get all articles in a blog.
 * @param blogId
 * @returns All articles in the blog.
 */
export const readArticlesByBlogId = async (
  blogId: string
): Promise<ArticleData[]> => {
  const articles = await Article.find({ blogId });
  return articles.map((a) => a.mapToArticleData());
};

/**
 * Update an article by id.
 * @param id
 * @param article
 * @param option A further filter. Currently, it supports:
 * - "blogId", which restrict user to update the article under a particular blog.
 * @returns Updated article or null if article doesn't exist.
 */
export const updateArticle = async (
  id: string,
  article: Partial<ArticlePostData>,
  option: { blogId?: string } = {}
): Promise<ArticleData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };

  const { blogId } = option;
  if (blogId) filter.blogId = blogId;
  const updatedArticle = await Article.findOneAndUpdate(
    filter,
    {
      $set: article,
    },
    { runValidators: true, returnDocument: "after" }
  );
  return updatedArticle ? updatedArticle.mapToArticleData() : null;
};
