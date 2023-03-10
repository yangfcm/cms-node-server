import { IBlog } from "src/models/blog";

export type BlogPostData = {
  title: IBlog["title"];
  address: IBlog["address"];
};

export type BlogData = {
  id: IBlog["_id"];
  title: IBlog["title"];
  address: IBlog["address"];
};
