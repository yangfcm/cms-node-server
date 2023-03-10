import { IBlog } from "../models/blog";
import { IUser } from "../models/user";

export type BlogPostData = {
  title: IBlog["title"];
  address: IBlog["address"];
  userId: IUser["_id"];
};

export type BlogData = {
  id: IBlog["_id"];
  title: IBlog["title"];
  address: IBlog["address"];
  userId: IBlog["userId"];
};
