import { ITag } from "../models/tag";

export type TagPostData = {
  name: ITag["name"];
};

export type TagNewData = TagPostData & {
  blogId: ITag["blogId"];
};

export type TagData = {
  id: ITag["_id"];
  name: ITag["name"];
  blogId: ITag["blogId"];
  createdAt: ITag["createdAt"];
  updatedAt: ITag["updatedAt"];
};

export type TagPopulatedData = Pick<TagData, "id" | "name">;
