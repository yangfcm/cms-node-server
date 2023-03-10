import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Reference to user.
  postId: string; // Reference to posts
  blogId: string; // Reference to blog. Comments can be made to either post or blog.
}
