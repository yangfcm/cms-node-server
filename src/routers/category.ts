import { Router, Request, Response } from "express";
import { CategoryData, CategoryPostData } from "../dtos/category";
import {
  categoryNameExistsInBlog,
  createCategory,
  readCategoriesByBlogId,
} from "../repositories/category";
import parseError, { APIError } from "../utils/parseError";
import getBlogByAddress from "../middleware/getBlogByAddress";
import { CATEGORY } from "../settings/constants";

const router = Router();

router.get(
  "/blogs/:address/categories",
  getBlogByAddress,
  async (
    req: Request<{ address: string }>,
    res: Response<CategoryData[] | APIError>
  ) => {
    const { blog } = req;
    try {
      if (!blog) return res.json([]);
      const categories = await readCategoriesByBlogId(blog.id);
      res.json(categories);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.post(
  "/blogs/:address/categories",
  getBlogByAddress,
  async (
    req: Request<{ address: string }, any, { category: CategoryPostData }>,
    res: Response<CategoryData | APIError>
  ) => {
    try {
      const { blog } = req;
      const { category } = req.body;
      const existingCategory = await categoryNameExistsInBlog(
        category.name,
        blog!.id
      );
      if (existingCategory) throw new Error(CATEGORY.NAME_IN_USE);
      const newCategory = await createCategory({
        ...category,
        blogId: blog!.id,
      });
      res.json(newCategory);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
