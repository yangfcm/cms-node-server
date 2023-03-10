import { BlogPostData, BlogData } from "../dtos/blog";
import Blog from "../models/blog";

export const createBlog = async (blog: BlogPostData): Promise<BlogData> => {
  const newBlog = new Blog(blog);
  await newBlog.save();
  return newBlog.mapToBlogData();
};

// Get all blogs by user id.
export const readBlogsByUserId = async (
  userId: string
): Promise<BlogData[]> => {
  const blogs = await Blog.find({ userId });
  return blogs.map((b) => b.mapToBlogData());
};

// Get one blog by blog id.
export const readBlog = async (id: string): Promise<BlogData | null> => {
  const blog = await Blog.findById(id);
  return blog ? blog.mapToBlogData() : null;
};

export const updateBlog = async (
  id: string,
  blog: Partial<BlogPostData>
): Promise<BlogData | null> => {
  const blogToUpdate = await Blog.findById(id);
  if (!blogToUpdate) return null;

  const { title, address, userId } = blog;
  if (title) blogToUpdate.title = title;
  if (address) blogToUpdate.address = address;
  if (userId) blogToUpdate.userId = userId;
  await blogToUpdate.save();

  return blogToUpdate?.mapToBlogData();
};
