import {
  CategoryPostData,
  CategoryNewData,
  CategoryData,
} from "../dtos/category";
import Category from "../models/category";

export const categoryNameExistsInBlog = async (
  categoryName: string,
  blogId: string
): Promise<boolean> => {
  const existingCategory = await Category.findOne({
    name: categoryName,
    blogId,
  });
  return !!existingCategory;
};

export const createCategory = async (
  category: CategoryNewData
): Promise<CategoryData> => {
  const newCategory = new Category(category);
  await newCategory.save();
  return newCategory.mapToCategoryData();
};

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
  if (!updatedCategory) return null;
  return updatedCategory.mapToCategoryData();
};
