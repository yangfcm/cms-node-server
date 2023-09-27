import { Request, Response, NextFunction } from "express";
import { readBlogByAddress } from "../repositories/blog";
import { BLOG } from "../settings/constants";

/**
 * getBlogByAddress, read blog address from url like /api/blogs/:address/articles
 * and pass the blog data to next handler.
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getBlogByAddress = async (
  req: Request<{ address?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;
  if (!address) return res.status(404).send({ message: BLOG.NOT_FOUND });

  const blog = await readBlogByAddress(address);
  if (!blog) return res.status(404).send({ message: BLOG.NOT_FOUND });

  req.blog = blog;
  next();
};

export default getBlogByAddress;
