import { Request, Response, NextFunction } from "express";
import { readBlogByAddress } from "../repositories/blog";

const getBlogByAddress = async (
  req: Request<{ address: string }>,
  res: Response,
  next: NextFunction
) => {
  const blog = await readBlogByAddress(req.params.address);
  if (blog) {
    req.body.blog = blog;
  }
  next();
};

export default getBlogByAddress;
