import { Router, Request, Response } from "express";
import { CategoryData, CategoryPostData } from "../dtos/category";
import {
  findCategoryByName,
  createCategory,
  deleteCategory,
  readCategoriesByBlogId,
  updateCategory,
} from "../repositories/category";
import parseError, { APIError } from "../utils/parseError";
import { CATEGORY } from "../settings/constants";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";

type CategoryResponse = {
  category: CategoryData
} | {
  categories: CategoryData[]
}

const router = Router();

router.get(
  "/",
  async (
    req: Request<{ address: string }>,
    res: Response<CategoryResponse | APIError>
  ) => {
    const { blog } = req;
    try {
      if (!blog) return res.json({
        categories: []
      });
      const categories = await readCategoriesByBlogId(blog.id);
      res.json({ categories });
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
    res: Response<CategoryResponse | APIError>
  ) => {
    try {
      const { blog } = req;
      const { category } = req.body;
      const foundCategory = await findCategoryByName(
        category.name,
        blog!.id
      );
      if (foundCategory) throw new Error(CATEGORY.NAME_IN_USE);
      const newCategory = await createCategory({
        ...category,
        blogId: blog!.id,
      });
      res.json({ category: newCategory });
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
    res: Response<CategoryResponse | APIError>
  ) => {
    try {
      const { blog } = req;
      const { categoryId } = req.params;
      const { category } = req.body;
      if (category.name && blog?.id) {
        const foundCategory = await findCategoryByName(category.name, blog.id);
        if (foundCategory && foundCategory.id !== categoryId) {
          throw new Error(CATEGORY.NAME_IN_USE);
        }
      }
      const updatedCategory = await updateCategory(
        categoryId,
        category,
        blog?.id
      );
      if (!updatedCategory) return res.status(404).send();
      res.json({ category: updatedCategory });
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.delete(
  '/:categoryId',
  [authenticate, userOwnsBlog],
  async (
    req: Request<{ address?: string; blogId?: string; categoryId: string }>,
    res: Response<CategoryResponse | APIError>
  ) => {
    try {
      const deletedCategory = await deleteCategory(req.params.categoryId);
      if (!deletedCategory) return res.status(404).send();
      res.json({ category: deletedCategory });
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
)

export default router;
