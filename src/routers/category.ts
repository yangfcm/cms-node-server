import { Router, Request, Response } from "express";
import { CategoryData, CategoryPostData } from "../dtos/category";
import {
  categoryNameExistsInBlog,
  createCategory,
  readCategoriesByBlogId,
  updateCategory,
} from "../repositories/category";
import parseError, { APIError } from "../utils/parseError";
import { CATEGORY } from "../settings/constants";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";

const router = Router();

router.get(
  "/",
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
  "/",
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ address?: string }, any, { category: CategoryPostData }>,
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

router.put(
  "/:categoryId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<
      { address?: string; blogId?: string; categoryId: string },
      any,
      { category: Partial<CategoryPostData> }
    >,
    res: Response<CategoryData | APIError>
  ) => {
    try {
      const updatedCategory = await updateCategory(
        req.params.categoryId,
        req.body.category,
        req.blog?.id
      );
      if (!updatedCategory) return res.status(404).send();
      res.json(updatedCategory);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
