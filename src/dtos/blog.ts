import { IBlog } from "../models/blog";
import { IUser } from "../models/user";

export type BlogPostData = {
  title: IBlog["title"];
  address: IBlog["address"];
};

export type BlogNewData = BlogPostData & {
  userId: IUser["_id"];
};

export type BlogData = {
  id: IBlog["_id"];
  title: IBlog["title"];
  address: IBlog["address"];
  userId: IBlog["userId"];
};

export type BlogPopulatedData = Pick<BlogData, "id" | "title" | "address">;
