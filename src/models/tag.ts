import mongoose, { Document, Schema } from "mongoose";
import { TAG } from "../settings/constants";
import { TagData } from "../dtos/tag";

export interface ITag extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string; // Reference to blog.
  mapToTagData: () => TagData;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, TAG.NAME_REQUIRED],
      minlength: [0, TAG.NAME_REQUIRED],
      maxlength: [TAG.MAX_NAME_LENGTH, TAG.NAME_TOO_LONG],
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

tagSchema.methods.mapToTagData = function (): TagData {
  const tag = this;
  return {
    id: tag._id.toString(),
    name: tag.name,
    blogId: tag.blogId,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  };
};

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
