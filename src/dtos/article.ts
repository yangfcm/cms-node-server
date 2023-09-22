import { IArticle } from "../models/article";

export type ArticlePostData = {
  title: IArticle["title"];
  content?: IArticle["content"];
  featuredImage?: IArticle["featuredImage"];
  status?: IArticle["status"];
  isTop?: IArticle["isTop"];
  categoryId?: IArticle["categoryId"];
  tagIds?: IArticle["tagIds"];
};

export type ArticleNewData = ArticlePostData & {
  blogId: IArticle["blogId"];
  userId: IArticle["userId"];
};

export type ArticleData = {
  id: IArticle["_id"];
  title: IArticle["title"];
  content: IArticle["content"];
  featuredImage: IArticle["featuredImage"];
  status: IArticle["status"];
  isTop: IArticle["isTop"];
  blogId: IArticle["blogId"];
  userId: IArticle["userId"];
  categoryId: IArticle["categoryId"];
  tagIds: IArticle["tagIds"];
};
