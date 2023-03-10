import mongoose, { Document, Schema } from "mongoose";

interface ITag extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  blogId: string; // Reference to blog.
}

const tagSchema = new mongoose.Schema<ITag>({});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
