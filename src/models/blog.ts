import mongoose, { Document, Model, Schema } from "mongoose";
import { isValidCharacters } from "../utils/validators";

import { BLOG } from "../settings/constants";
import { BlogData } from "../dtos/blog";

// Space is also known as 'blog', has one-to-one relationship to user.
export interface IBlog extends Document {
  title: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Reference to user.
  mapToBlogData: () => BlogData;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, BLOG.TITLE_REQUIRED],
      maxlength: [BLOG.MAX_TITLE_LENGTH, BLOG.TITLE_TOO_LONG],
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, BLOG.ADDRESS_REQUIRED],
      validate: [
        {
          validator: (value: string) => isValidCharacters(value),
          message: BLOG.INVALID_ADDRESS,
        },
        {
          async validator(value: string): Promise<boolean> {
            let existingAddress;
            const { model } = this as any;
            // console.log(this.constructor);
            if (this instanceof Model) {
              const model = this.constructor as Model<Document>;
              existingAddress = await model.findOne({ address: value });
            } else if (model) {
              existingAddress = await model.findOne({ address: value });
            }
            return !existingAddress;
          },
          message: BLOG.ADDRESS_IN_USE,
        },
      ],
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

blogSchema.methods.mapToBlogData = function (): BlogData {
  const blog = this;
  return {
    id: blog._id,
    title: blog.title,
    address: blog.address,
    userId: blog.userId,
  };
};

const Blog = mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;
