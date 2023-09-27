import { Router, Request, Response, NextFunction } from "express";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import { CommentData, CommentPostData } from "../dtos/comment";
import {
  createComment,
  deleteComment,
  readCommentById,
  readCommentsByArticleId,
  readCommentsByBlogId,
  updateComment,
} from "../repositories/comment";

type CommentResponse =
  | {
      comment: CommentData;
    }
  | {
      comments: CommentData[];
    };

const router = Router();

router.get("/check", (req, res) => {
  res.send("Comment router is working.");
});

/**
 * Post a comment
 */
router.post(
  "/",
  [authenticate],
  async (
    req: Request<any, any, { comment: CommentPostData }>,
    res: Response<CommentResponse>,
    next: NextFunction
  ) => {
    try {
      const { blog, user } = req;
      const { comment } = req.body;
      const newComment = await createComment({
        ...comment,
        blogId: blog?.id,
        userId: user?.id,
      });
      res.json({ comment: newComment });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * Get one comment
 */
router.get(
  "/:commentId",
  async (
    req: Request<{ commentId: string }>,
    res: Response<CommentResponse>,
    next: NextFunction
  ) => {
    try {
      const { commentId } = req.params;
      const comment = await readCommentById(commentId);
      if (!comment) return res.status(404).send();
      res.json({ comment });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * Get all comments for a blog
 * Get comments for an article if articleId is specified.
 */
router.get(
  "/",
  async (
    req: Request<any, any, any, { articleId?: string }>,
    res: Response<CommentResponse>,
    next: NextFunction
  ) => {
    try {
      const { articleId } = req.query;
      const { blog } = req;
      let comments: CommentData[] = [];
      if (articleId) {
        comments = await readCommentsByArticleId(articleId, blog?.id);
        return res.json({ comments });
      }
      comments = await readCommentsByBlogId(blog?.id);
      res.json({ comments });
    } catch (err: any) {
      next(err);
    }
  }
);

/**
 * Update a comment
 */
router.put(
  "/:commentId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<
      { address?: string; blogId?: string; commentId: string },
      any,
      { comment: Partial<CommentPostData> }
    >,
    res: Response<CommentResponse>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const { commentId } = req.params;
      const { comment } = req.body;
      const updatedComment = await updateComment(commentId, comment, blog?.id);
      if (!updatedComment) return res.status(404).send();
      res.json({ comment: updatedComment });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Delete a comment
 */
router.delete(
  "/:commentId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ address?: string; blogId?: string; commentId: string }>,
    res: Response<CommentResponse>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const deletedComment = await deleteComment(
        req.params.commentId,
        blog?.id
      );
      if (!deletedComment) return res.status(404).send();
      res.json({ comment: deletedComment });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
