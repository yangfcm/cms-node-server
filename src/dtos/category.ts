import { ICategory } from "../models/category";

export type CategoryPostData = {
  name: ICategory["name"];
  description: ICategory["description"];
};

export type CategoryNewData = CategoryPostData & {
  blogAddress: ICategory["blogAddress"];
};

export type CategoryData = {
  id: ICategory["_id"];
  name: ICategory["name"];
  description: ICategory["description"];
  blogAddress: ICategory["blogAddress"];
};
