import { BlogPostData, BlogData, BlogNewData } from "../dtos/blog";
import Blog from "../models/blog";

export const createBlog = async (
  blog: BlogNewData,
  options: Object = {}
): Promise<BlogData> => {
  const newBlog = new Blog(blog);
  await newBlog.save(options);
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

export const readBlogByAddress = async (
  address: string
): Promise<BlogData | null> => {
  const blog = await Blog.findOne({
    address,
  });
  return blog ? blog.mapToBlogData() : null;
};

export const updateBlog = async (
  id: string,
  blog: Partial<BlogPostData>
): Promise<BlogData | null> => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    {
      $set: blog,
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  );
  if (!updatedBlog) return null;
  return updatedBlog.mapToBlogData();
};

export const deleteBlog = async (
  id: string,
  options: Object = {}
): Promise<BlogData | null> => {
  const deletedBlog = await Blog.findByIdAndDelete(id, options);
  if (!deletedBlog) return null;
  return deletedBlog.mapToBlogData();
};
