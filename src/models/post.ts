import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  blogId: string; // Reference to blog.
  userId: string; // Reference to User.
  categoryId: string; // Reference to category.
  tagIds: string[]; // Reference to tag.
}

const postSchema = new mongoose.Schema<IPost>({});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
