import { IComment } from "../models/comment";

export type CommentPostData = {
  content: IComment["content"];
  articleId: IComment["articleId"];
  status?: IComment["status"];
  isTop?: IComment["isTop"];
};

export type CommentNewData = CommentPostData & {
  blogId: IComment["blogId"];
  userId: IComment["userId"];
};

export type CommentData = {
  id: IComment["_id"];
  content: IComment["content"];
  status: IComment["status"];
  isTop: IComment["isTop"];
  articleId: IComment["articleId"];
  blogId: IComment["blogId"];
  userId: IComment["userId"];
  createdAt: IComment["createdAt"];
  updatedAt: IComment["updatedAt"];
};
