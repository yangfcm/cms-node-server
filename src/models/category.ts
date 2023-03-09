import mongoose, { Document, Schema } from "mongoose";
import { CATEGORY } from "../settings/constants";

interface ICategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, CATEGORY.NAME_REQUIRED],
      minlength: [0, CATEGORY.NAME_REQUIRED],
      maxlength: [CATEGORY.MAX_NAME_LENGTH, CATEGORY.NAME_TOO_LONG],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [
        CATEGORY.MAX_DESCRIPTION_LENGTH,
        CATEGORY.DESCRIPTION_TOO_LONG,
      ],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
