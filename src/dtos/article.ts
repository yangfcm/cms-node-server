import { IArticle } from "../models/article";
import { BlogPopulatedData } from "./blog";
import { CategoryPopulatedData } from "./category";
import { TagPopulatedData } from "./tag";
import { UserPopulatedData } from "./user";

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
  blog: BlogPopulatedData | IArticle["blogId"];
  user: UserPopulatedData | IArticle["userId"];
  category: CategoryPopulatedData | IArticle["categoryId"];
  tags: TagPopulatedData[] | IArticle["tagIds"];
  createdAt: IArticle["createdAt"];
  updatedAt: IArticle["updatedAt"];
};
