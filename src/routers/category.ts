import { Router, Request, Response } from "express";
import { CategoryData } from "../dtos/category";
import { readCategoriesByBlogId } from "../repositories/category";
import parseError, { APIError } from "../utils/parseError";
import getBlogByAddress from "../middleware/getBlogByAddress";
import { BlogData } from "../dtos/blog";

const router = Router();

router.get(
  "/blogs/:address/categories",
  getBlogByAddress,
  async (
    req: Request<{ address: string }, any, { blog?: BlogData }>,
    res: Response<CategoryData[] | APIError>
  ) => {
    const { blog } = req.body;
    try {
      if (!blog) return res.json([]);
      const categories = await readCategoriesByBlogId(blog.id);
      res.json(categories);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
