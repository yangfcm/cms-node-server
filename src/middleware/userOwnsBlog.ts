import { Request, Response, NextFunction } from "express";
import { BlogData } from "../dtos/blog";
import { readBlog, readBlogByAddress } from "../repositories/blog";
import { BLOG } from "../settings/constants";
import parseError from "../utils/parseError";

const userOwnsBlog = async (
  req: Request<{ blogId?: string; address?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { blogId, address } = req.params; // Read blog id or address from request url's params.
    const { blog, user } = req; // The blog data is already attached to req, which is from 'getBlogByAddress' middleware, 
    // and user data is attached to req, which is from 'authenticate' middleware.
    if (blog && user && blog.userId === user.id) return next();

    let foundBlog: BlogData | null = null;
    if (blogId) {
      foundBlog = await readBlog(blogId);
    }
    if (address) {
      foundBlog = await readBlogByAddress(address);
    }
    if (foundBlog && user && foundBlog.userId === user.id) {
      return next();
    }
    res.status(402).send({
      message: BLOG.NO_ACCESS_TO_BLOG,
    });
  } catch (err) {
    res.status(400).json(parseError(err));
  }
};

export default userOwnsBlog;
