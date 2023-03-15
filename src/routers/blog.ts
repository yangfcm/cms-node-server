import { Router, Request, Response } from "express";
import { BlogData, BlogPostData, BlogNewData } from "../dtos/blog";
import { UserData } from "../dtos/user";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";
import {
  readBlogsByUserId,
  readBlogByAddress,
  createBlog,
  updateBlog,
} from "../repositories/blog";
import parseError, { APIError } from "../utils/parseError";

const router = Router();

router.post(
  "/",
  authenticate,
  async (
    req: Request<any, any, { blog: BlogPostData }>,
    res: Response<BlogData | APIError>
  ) => {
    try {
      const { user } = req;
      const { blog } = req.body;
      const newBlog = await createBlog({ ...blog, userId: user?.id });
      return res.json(newBlog);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response<BlogData[] | APIError>) => {
    try {
      const { user } = req;
      const blogs = await readBlogsByUserId(user?.id);
      res.json(blogs);
    } catch (err) {
      res.status(400).json(parseError(err));
    }
  }
);

router.get(
  "/:address",
  async (
    req: Request<{ address: string }>,
    res: Response<BlogData | APIError>
  ) => {
    try {
      const { address } = req.params;
      const blog = await readBlogByAddress(address);
      if (!blog) return res.status(404).send();
      res.json(blog);
    } catch (err) {
      res.status(400).json(parseError(err));
    }
  }
);

router.put(
  "/:blogId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ blogId?: string }, any, { blog: Partial<BlogPostData> }>,
    res: Response<BlogData | APIError>
  ) => {
    try {
      const updatedBlog = await updateBlog(
        req.params.blogId || "",
        req.body.blog
      );
      if (!updatedBlog) return res.status(404).send();
      res.json(updatedBlog);
    } catch (err) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
