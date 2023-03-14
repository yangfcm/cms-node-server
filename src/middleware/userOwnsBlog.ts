import { Request, Response, NextFunction } from "express";
import { UserData } from "../dtos/user";
import { readBlog } from "../repositories/blog";
import { BLOG } from "../settings/constants";
import parseError from "../utils/parseError";

const userOwnsBlog = async (
  req: Request<{ id: string }, any, { authUser: UserData }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { authUser } = req.body;
    const blog = await readBlog(id);
    if (!blog) return res.status(404).send();
    if (blog.userId !== authUser.id)
      return res.status(403).send({
        message: BLOG.NO_ACCESS_TO_BLOG,
      });
    next();
  } catch (err) {
    res.status(400).json(parseError(err));
  }
};

export default userOwnsBlog;
