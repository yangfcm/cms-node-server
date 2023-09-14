import { IComment } from "../models/comment";

export type CommentPostData = {
  content: IComment["content"];
};

export type CommentNewData = CommentPostData & {
  articleId: IComment["articleId"];
  userId: IComment["userId"];
};

export type CommentData = {
  id: IComment["_id"];
  content: IComment["content"];
  articleId: IComment["articleId"];
  userId: IComment["userId"];
  createdAt: IComment["createdAt"];
  updatedAt: IComment["updatedAt"];
};
