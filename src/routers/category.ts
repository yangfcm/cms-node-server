import { Router, Request, Response } from "express";
import { CategoryData } from "../dtos/category";
import { readCategoriesByBlogAddress } from "../repositories/category";
import parseError, { APIError } from "../utils/parseError";

const router = Router();

router.get(
  "/blogs/:address/categories",
  async (
    req: Request<{ address: string }>,
    res: Response<CategoryData[] | APIError>
  ) => {
    try {
      const categories = await readCategoriesByBlogAddress(req.params.address);
      res.json(categories);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
