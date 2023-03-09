import mongoose, { Document, Schema } from "mongoose";

interface ITag extends Document {}

const tagSchema = new mongoose.Schema<ITag>({});

const Tag = mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
