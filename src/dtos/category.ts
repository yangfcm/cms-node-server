import { ICategory } from "../models/category";

export type CategoryPostData = {
  name: ICategory["name"];
  description?: ICategory["description"];
};

export type CategoryNewData = CategoryPostData & {
  blogId: ICategory["blogId"];
};

export type CategoryData = {
  id: ICategory["_id"];
  name: ICategory["name"];
  description: ICategory["description"];
  blogId: ICategory["blogId"];
  createdAt: ICategory["createdAt"];
  updatedAt: ICategory["updatedAt"];
};

export type CategoryPopulatedData = Pick<
  CategoryData,
  "id" | "name" | "description"
>;
