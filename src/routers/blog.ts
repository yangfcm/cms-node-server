import { Router, Request, Response } from "express";
import { BlogData } from "../dtos/blog";
import { UserData } from "../dtos/user";
import authenticate from "../middleware/authenticate";
import { readBlogsByUserId } from "../repositories/blog";
import parseError, { APIError } from "../utils/parseError";

const router = Router();

router.get(
  "/blogs",
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

router.post("/blogs", async () => {});

export default router;
