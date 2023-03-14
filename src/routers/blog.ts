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
    req: Request<any, any, { authUser: UserData; blog: BlogPostData }>,
    res: Response<BlogData | APIError>
  ) => {
    try {
      const { authUser, blog } = req.body;
      const newBlog = await createBlog({ ...blog, userId: authUser.id });
      return res.json(newBlog);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.get(
  "/",
  authenticate,
  async (
    req: Request<any, any, { authUser: UserData }>,
    res: Response<BlogData[] | APIError>
  ) => {
    try {
      const { authUser } = req.body;
      const blogs = await readBlogsByUserId(authUser.id);
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
  "/:id",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ id: string }, any, { blog: Partial<BlogPostData> }>,
    res: Response<BlogData | APIError>
  ) => {
    try {
      const updatedBlog = await updateBlog(req.params.id, req.body.blog);
      if (!updatedBlog) return res.status(404).send();
      res.json(updatedBlog);
    } catch (err) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
