import mongoose, { Document, Schema } from "mongoose";
import { COMMENT } from "../settings/constants";
import { CommentData } from "../dtos/comment";

export interface IComment extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Reference to user.
  articleId: string; // Reference to posts
  // blogId: string; // Reference to blog. Comments can be made to either post or blog. For now, not consider blog comments.
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      trim: true,
      required: [true, COMMENT.CONTENT_REQUIRED],
      minlength: [0, COMMENT.CONTENT_REQUIRED],
      maxlength: [COMMENT.MAX_CONTENT_LENGTH, COMMENT.CONTENT_TOO_LONG],
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    articleId: {
      type: String,
      required: true,
      ref: "Article",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

commentSchema.methods.mapToCommentData = function (): CommentData {
  const comment = this;
  return {
    id: comment._id.toString(),
    content: comment.content,
    userId: comment.userId,
    articleId: comment.articleId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
