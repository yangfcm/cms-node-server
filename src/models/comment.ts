import mongoose, { Document, Schema } from "mongoose";
import { COMMENT } from "../settings/constants";
import { CommentData } from "../dtos/comment";

export enum CommentStatus {
  PENDING = "pending", // Some user may want the comment to be published before they review it.
  // So, pending is the status that user leaves the comment and awaiting author to approve it.
  PUBLIC = "public", // Can be viewed by every one.
  CENSORED = "censored", // Not displayed, only can be viewed by blog owner.
  TRASH = "trash", // Deleted comment.
}

export interface IComment extends Document {
  content: string;
  status: CommentStatus;
  isTop: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Reference to user.
  articleId: string; // Reference to posts
  blogId: string; // Reference to blog
  mapToCommentData: () => CommentData;
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
    status: {
      type: String,
      enum: [
        CommentStatus.CENSORED,
        CommentStatus.PUBLIC,
        CommentStatus.PENDING,
      ],
      required: true,
      default: CommentStatus.PUBLIC,
    },
    isTop: {
      type: Boolean,
      required: true,
      default: false,
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

commentSchema.methods.mapToCommentData = function (): CommentData {
  const comment = this;
  return {
    id: comment._id.toString(),
    content: comment.content,
    status: comment.status,
    isTop: comment.isTop,
    userId: comment.userId,
    articleId: comment.articleId,
    blogId: comment.blogId,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
