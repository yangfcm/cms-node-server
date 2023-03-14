import { Router, Request, Response } from "express";
import { BlogData, BlogPostData, BlogNewData } from "../dtos/blog";
import { UserData } from "../dtos/user";
import authenticate from "../middleware/authenticate";
import { readBlogsByUserId, readBlog, createBlog } from "../repositories/blog";
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
  "/:id",
  async (req: Request<{ id: string }>, res: Response<BlogData | APIError>) => {
    try {
      const { id } = req.params;
      const blog = await readBlog(id);
      if (!blog) return res.status(404).send();
      res.json(blog);
    } catch (err) {
      res.status(400).json(parseError(err));
    }
  }
);

router.post("/blogs", async () => {});

export default router;
