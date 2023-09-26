import {
  CategoryPostData,
  CategoryNewData,
  CategoryData,
} from "../dtos/category";
import Category from "../models/category";

/**
 * Given blog id and a category name, find out the category by name in the given blog.
 * @param categoryName
 * @param blogId Optional. If blogId is given, find the category in this blog.
 * @returns The category found or null if not found.
 */
export const findCategoryByName = async (
  categoryName: string,
  blogId?: string
): Promise<CategoryData | null> => {
  const filter: { name: string; blogId?: string } = { name: categoryName };
  if (blogId) filter.blogId = blogId;
  const category = await Category.findOne(filter);
  return category?.mapToCategoryData() || null;
};

/**
 * Create a category.
 * @param category
 * @returns The category data created
 */
export const createCategory = async (
  category: CategoryNewData
): Promise<CategoryData> => {
  const newCategory = new Category(category);
  await newCategory.save();
  return newCategory.mapToCategoryData();
};

/**
 * Get a category by id
 * @param id
 * @param blogId Optional. If provided, find category by id in the blog only.
 * @returns The category found or null if not found.
 */
export const readCategoryById = async (
  id: string,
  blogId?: string
): Promise<CategoryData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const category = await Category.findOne(filter);
  return category?.mapToCategoryData() || null;
};

/**
 * Get the categories for a blog.
 * If blogId not provided, get all categories.
 * @param blogId
 * @returns The categories under the blog with given blog id.
 */
export const readCategories = async (
  blogId?: string
): Promise<CategoryData[]> => {
  const filter: { blogId?: string } = {};
  if (blogId) filter.blogId = blogId;
  const categories = await Category.find(filter);
  return (categories || []).map((c) => c.mapToCategoryData());
};

/**
 * Update a category by given id.
 * If blogId exists, it restricts to updating the category with the id under the blog.
 * @param id
 * @param category
 * @param blogId
 * @returns updated category or null if category not found.
 */
export const updateCategory = async (
  id: string,
  category: Partial<CategoryPostData>,
  blogId?: string
): Promise<CategoryData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const updatedCategory = await Category.findOneAndUpdate(
    filter,
    {
      $set: category,
    },
    {
      runValidators: true,
      returnDocument: "after",
    }
  );
  return updatedCategory?.mapToCategoryData() || null;
};

/**
 * Delete a category by id
 * If blogId exists, it restricts to deleting the category with the id under the blog.
 * @param id
 * @param blogId
 * @returns  The deleted category or null if category not found.
 */
export const deleteCategory = async (
  id: string,
  blogId?: string
): Promise<CategoryData | null> => {
  const filter: { _id: string; blogId?: string } = { _id: id };
  if (blogId) filter.blogId = blogId;
  const category = await Category.findOneAndDelete(filter);
  return category?.mapToCategoryData() || null;
};
