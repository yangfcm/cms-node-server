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

export const updateCategory = async (
  id: string,
  category: Partial<CategoryPostData>
): Promise<CategoryData | null> => {
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
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
