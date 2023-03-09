import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {}

const postSchema = new mongoose.Schema<IPost>({});

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
