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
 * @param id
 * @returns The comment if found or null otherwise.
 */
export const readCommentById = async (
  id: string
): Promise<CommentData | null> => {
  const comment = await Comment.findById(id);
  return comment?.mapToCommentData() || null;
};

/**
 * Get the comments for an article.
 * @param articleId
 * @returns The comments for an article.
 */
export const readCommentsByArticleId = async (
  articleId: string
): Promise<CommentData[]> => {
  const comments = await Comment.find({
    articleId,
  });
  return comments.map((c) => c.mapToCommentData());
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
  return comments.map((c) => c.mapToCommentData());
};

/**
 * Update a comment
 * @param id
 * @param comment
 * @returns
 */
export const updateComment = async (
  id: string,
  comment: Partial<CommentPostData>
): Promise<CommentData | null> => {
  const updatedComment = await Comment.findByIdAndUpdate(
    id,
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
 * @param id
 * @returns The deleted comment data.
 */
export const deleteComment = async (
  id: string
): Promise<CommentData | null> => {
  const deletedComment = await Comment.findByIdAndDelete(id);
  return deletedComment?.mapToCommentData() || null;
};
