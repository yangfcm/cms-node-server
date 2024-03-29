import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BlogData, BlogPostData } from "../dtos/blog";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import {
  readBlogsByUserId,
  readBlogByAddress,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../repositories/blog";
import { updateUser } from "../repositories/user";

type BlogResponse =
  | {
      blog: BlogData;
    }
  | { blogs: BlogData[] };

const router = Router();

router.post(
  "/",
  authenticate,
  async (
    req: Request<any, any, { blog: BlogPostData }>,
    res: Response<BlogResponse>,
    next: NextFunction
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { user } = req;
      const { blog } = req.body;
      const newBlog = await createBlog(
        { ...blog, userId: user?.id },
        { session }
      );
      await updateUser(
        user?.id,
        {
          blogs: [...(user?.blogs || []).map((b) => b.id), newBlog.id],
        },
        { session }
      );
      await session.commitTransaction();
      return res.json({ blog: newBlog });
    } catch (err: any) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  }
);

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response<BlogResponse>, next: NextFunction) => {
    try {
      const { user } = req;
      const blogs = await readBlogsByUserId(user?.id);
      res.json({ blogs });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:address",
  async (
    req: Request<{ address: string }>,
    res: Response<BlogResponse>,
    next: NextFunction
  ) => {
    try {
      const { address } = req.params;
      const blog = await readBlogByAddress(address);
      if (!blog) return res.status(404).send();
      res.json({ blog });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:blogId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ blogId?: string }, any, { blog: Partial<BlogPostData> }>,
    res: Response<BlogResponse>,
    next: NextFunction
  ) => {
    try {
      const updatedBlog = await updateBlog(
        req.params.blogId || "",
        req.body.blog
      );
      if (!updatedBlog) return res.status(404).send();
      res.json({ blog: updatedBlog });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:blogId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ blogId?: string }>,
    res: Response<BlogResponse>,
    next: NextFunction
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { user } = req;
      // @TODO: Delete other resources, like articles, tags, categories etc. under the blog.
      // 1. Delete comments 2. Delete articles 3. Delete categories and tags.
      const deletedBlog = await deleteBlog(req.params.blogId || "", {
        session,
      });
      if (!deletedBlog) return res.status(404).send();
      await updateUser(
        user?.id,
        {
          blogs: (user?.blogs || [])
            .filter((b) => b.id !== deletedBlog.id)
            .map((b) => b.id),
        },
        {
          session,
        }
      );
      await session.commitTransaction();
      res.json({ blog: deletedBlog });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  }
);

export default router;
