import {
  CategoryPostData,
  CategoryNewData,
  CategoryData,
} from "../dtos/category";
import Category from "../models/category";

/**
 * Given blog id and a category name, find out the category by name in the given blog.
 * @param categoryName 
 * @param blogId 
 * @returns The category found or null if not found.
 */
export const findCategoryByNameInBlog = async (
  categoryName: string,
  blogId: string
): Promise<CategoryData | null> => {
  const category = await Category.findOne({
    name: categoryName,
    blogId,
  });
  return category ? category.mapToCategoryData() : null;
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
 * Get the categories for a blog.
 * @param blogId 
 * @returns The categories under the blog with given blog id.
 */
export const readCategoriesByBlogId = async (
  blogId: string
): Promise<CategoryData[]> => {
  const categories = await Category.find({ blogId });
  return categories.map((c) => c.mapToCategoryData());
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
  return updatedCategory ? updatedCategory.mapToCategoryData() : null;
};

/**
 * Delete a category by id
 * @param id 
 * @returns  The deleted category or null if category not found.
 */
export const deleteCategory = async (id: string): Promise<CategoryData | null> => {
  const category = await Category.findById(id);
  if (!category) return null;
  await category.deleteOne();
  return category.mapToCategoryData();
}