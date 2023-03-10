import mongoose, { Document, Schema } from "mongoose";

// Space is also known as 'blog', has one-to-one relationship to user.
export interface ISpace extends Document {
  title: string;
  bannerImage: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Reference to user.
}
