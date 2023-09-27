import { Router, Request, Response, NextFunction } from "express";
import { ArticleData, ArticlePostData } from "../dtos/article";
import {
  createArticle,
  readArticleById,
  readArticles,
  updateArticle,
} from "../repositories/article";
import authenticate from "../middleware/authenticate";
import userOwnsBlog from "../middleware/userOwnsBlog";

type ArticleResponse =
  | {
      article: ArticleData;
    }
  | {
      articles: ArticleData[];
    };

const router = Router();

router.get(
  "/",
  async (req: Request, res: Response<ArticleResponse>, next: NextFunction) => {
    const { blog } = req;
    try {
      const articles = await readArticles(blog?.id);
      res.json({ articles });
    } catch (err: any) {
      next(err);
    }
  }
);

router.get(
  "/:articleId",
  async (
    req: Request<{ address?: string; blogId?: string; articleId: string }>,
    res: Response<ArticleResponse>,
    next: NextFunction
  ) => {
    try {
      const { articleId } = req.params;
      const article = await readArticleById(articleId);
      if (!article) return res.status(404).send();
      res.json({
        article,
      });
    } catch (err: any) {
      next(err);
    }
  }
);

router.post(
  "/",
  [authenticate, userOwnsBlog],
  async (
    req: Request<any, any, { article: ArticlePostData }>,
    res: Response<ArticleResponse>,
    next: NextFunction
  ) => {
    const { blog, user } = req;
    const { article } = req.body;
    try {
      const newArticle = await createArticle({
        ...article,
        userId: user!.id,
        blogId: blog!.id,
      });
      res.json({ article: newArticle });
    } catch (err: any) {
      next(err);
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
    res: Response<ArticleResponse>,
    next: NextFunction
  ) => {
    try {
      const { blog } = req;
      const { articleId } = req.params;
      const { article } = req.body;
      const updatedArticle = await updateArticle(articleId, article, blog?.id);
      if (!updatedArticle) return res.status(404).send();
      res.json({ article: updatedArticle });
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
