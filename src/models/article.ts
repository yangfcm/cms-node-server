import mongoose, { Document } from "mongoose";
import { ArticleData } from "../dtos/article";
import { ARTICLE } from "../settings/constants";

export enum ArticleStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  TRASH = "trash",
}

export interface IArticle extends Document {
  title: string;
  content: string;
  featuredImage: string;
  status: ArticleStatus;
  isTop: boolean;
  createdAt: Date;
  updatedAt: Date;
  // publishedAt: Date;
  blogId: string; // Reference to blog.
  userId: string; // Reference to User.
  categoryId: string; // Reference to category.
  tagIds: string[]; // Reference to tag.
  mapToArticleData: () => ArticleData;
}

const articleSchema = new mongoose.Schema<IArticle>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, ARTICLE.TITLE_REQUIRED],
      maxlength: [ARTICLE.MAX_TITLE_LENGTH, ARTICLE.TITLE_TOO_LONG],
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    featuredImage: String,
    status: {
      type: String,
      enum: [ArticleStatus.DRAFT, ArticleStatus.PUBLISHED, ArticleStatus.TRASH],
      required: true,
      default: ArticleStatus.DRAFT,
    },
    isTop: {
      type: Boolean,
      required: true,
      default: false,
    },
    blogId: {
      type: String,
      required: true,
      ref: "Blog",
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    categoryId: {
      type: String,
      required: true,
      ref: "Category",
    },
    tagIds: {
      type: [String],
      ref: "Tag",
      required: true,
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

articleSchema.methods.mapToArticleData = function (): ArticleData {
  const article = this;
  return {
    id: article._id.toString(),
    title: article.title,
    content: article.content,
    featuredImage: article.featuredImage,
    status: article.status,
    isTop: article.isTop,
    blog:
      typeof article.blogId === "string"
        ? article.blogId
        : {
            id: article.blogId._id?.toString(),
            title: article.blogId.title,
            address: article.blogId.address,
          },
    user:
      typeof article.userId === "string"
        ? article.userId
        : {
            id: article.userId._id?.toString(),
            username: article.userId.username,
            nickname: article.userId.nickname,
            biography: article.userId.biography,
            avatar: article.userId.avatar,
          },
    category:
      typeof article.categoryId === "string"
        ? article.categoryId
        : {
            id: article.categoryId._id?.toString(),
            name: article.categoryId.name,
            description: article.categoryId.description,
          },
    tags: article.tagIds.map((t: any) =>
      typeof t === "string"
        ? t
        : {
            id: t._id?.toString(),
            name: t.name,
          }
    ),
  };
};

const Article = mongoose.model<IArticle>("Article", articleSchema);

export default Article;
