import mongoose, { Document, Schema } from "mongoose";
import { CategoryData } from "../dtos/category";
import { CATEGORY } from "../settings/constants";

export interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string; // Reference to blog.
  mapToCategoryData: () => CategoryData;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, CATEGORY.NAME_REQUIRED],
      minlength: [0, CATEGORY.NAME_REQUIRED],
      maxlength: [CATEGORY.MAX_NAME_LENGTH, CATEGORY.NAME_TOO_LONG],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        CATEGORY.MAX_DESCRIPTION_LENGTH,
        CATEGORY.DESCRIPTION_TOO_LONG,
      ],
    },
    blogId: {
      type: String,
      required: true,
      ref: "Blog",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

categorySchema.methods.mapToCategoryData = function (): CategoryData {
  const category = this;
  return {
    id: category._id.toString(),
    name: category.name,
    description: category.description,
    blogId: category.blogId,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
