import Comment from "../models/comment";
import { CommentData, CommentNewData, CommentPostData } from "../dtos/comment";

/**
 * Create a comment
 * @param comment
 * @returns The comment created.
 */
export const createComment = async (
  comment: CommentNewData
): Promise<CommentData> => {
  const newComment = new Comment(comment);
  await newComment.save();
  return newComment.mapToCommentData();
};

/**
 * Get a comment by id
 * If blogId is provided, get the comment by id in this blog only.
 * @param id
 * @param blogId
 * @returns The comment if found or null otherwise.
 */
export const readCommentById = async (
  id: string,
  blogId?: string
): Promise<CommentData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const comment = await Comment.findOne(filter);
  return comment?.mapToCommentData() || null;
};

/**
 * Get the comments for an article.
 * If blogId is provided, get the comment by id in this blog only.
 * @param articleId
 * @param blogId
 * @returns The comments for an article.
 */
export const readCommentsByArticleId = async (
  articleId: string,
  blogId?: string
): Promise<CommentData[]> => {
  const filter: { articleId: string; blogId?: string } = { articleId };
  if (blogId) filter.blogId = blogId;
  const comments = await Comment.find(filter);
  return (comments || []).map((c) => c.mapToCommentData());
};

/**
 * Get the comments for a blog
 * @param blogId
 * @returns The comments for a blog.
 */
export const readCommentsByBlogId = async (
  blogId: string
): Promise<CommentData[]> => {
  const comments = await Comment.find({
    blogId,
  });
  return (comments || []).map((c) => c.mapToCommentData());
};

/**
 * Update a comment
 * If blogId provided, it restricts to updating the comment under the blog.
 * @param id
 * @param comment
 * @param blogId
 * @returns
 */
export const updateComment = async (
  id: string,
  comment: Partial<CommentPostData>,
  blogId?: string
): Promise<CommentData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const updatedComment = await Comment.findOneAndUpdate(
    filter,
    {
      $set: comment,
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  );
  return updatedComment?.mapToCommentData() || null;
};

/**
 * Delete a comment
 * If blodId exists, it restricts to deleting the comment with the id under the blog.
 * @param id
 * @param blogId
 * @returns The deleted comment data.
 */
export const deleteComment = async (
  id: string,
  blogId?: string
): Promise<CommentData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const deletedComment = await Comment.findOneAndDelete(filter);
  return deletedComment?.mapToCommentData() || null;
};

/**
 * Delete comments by blogId.
 * @param blogId
 * @returns The number of comments deleted.
 */
export const deleteCommentsByBlogId = async (
  blogId: string
): Promise<number> => {
  const { deletedCount } = await Comment.deleteMany({ blogId });
  return deletedCount;
};

/**
 * Delete comments by articleId
 * @param articleId
 * @returns The number of comments deleted.
 */
export const deleteCommentsByArticleId = async (
  articleId: string
): Promise<number> => {
  const { deletedCount } = await Comment.deleteMany({ articleId });
  return deletedCount;
};
