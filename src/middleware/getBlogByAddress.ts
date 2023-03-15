import { Request, Response, NextFunction } from "express";
import { readBlogByAddress } from "../repositories/blog";
import { BLOG } from "../settings/constants";

const getBlogByAddress = async (
  req: Request<{ address?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.params;
  if (!address) return res.status(404).send({ message: BLOG.NOT_FOUND });

  const blog = await readBlogByAddress(address);
  if (!blog) return res.status(404).send({ message: BLOG.NOT_FOUND });

  req.body.blog = blog;
  next();
};

export default getBlogByAddress;
