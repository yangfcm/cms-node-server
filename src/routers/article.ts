import { Router, Request, Response, request } from "express";
import { ArticleData, ArticlePostData } from "../dtos/article";
import {
  createArticle,
  readArticlesByBlogId,
  updateArticle,
} from "../repositories/article";
import parseError, { APIError } from "../utils/parseError";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response<ArticleData[] | APIError>) => {
    const { blog } = req;
    try {
      if (!blog) return res.json([]);
      const articles = await readArticlesByBlogId(blog.id);
      res.json(articles);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.post(
  "/",
  [authenticate, userOwnsBlog],
  async (
    req: Request<any, any, { article: ArticlePostData }>,
    res: Response<ArticleData | APIError>
  ) => {
    const { blog, user } = req;
    const { article } = req.body;
    try {
      const newArticle = await createArticle({
        ...article,
        userId: user!.id,
        blogId: blog!.id,
      });
      res.json(newArticle);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.put(
  "/:articleId",
  [authenticate, userOwnsBlog],
  async (
    req: Request<
      { address?: string; blogId?: string; articleId: string },
      any,
      { article: Partial<ArticlePostData> }
    >,
    res: Response<ArticleData | APIError>
  ) => {
    try {
      const { blog } = req;
      const { articleId } = req.params;
      const { article } = req.body;
      const updatedArticle = await updateArticle(articleId, article, {
        blogId: blog?.id,
      });
      if (!updatedArticle) return res.status(404).send();
      res.json(updatedArticle);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;