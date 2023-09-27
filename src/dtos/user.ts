import mongoose from "mongoose";

import { IUser } from "../models/user";

export type UserSignupData = {
  email: IUser["email"];
  username: IUser["username"];
  nickname?: IUser["nickname"];
  biography?: IUser["biography"];
  avatar?: IUser["avatar"];
  password: IUser["password"];
};

export type UserSigninData = {
  identity: IUser["email"] | IUser["username"];
  password: IUser["password"];
};

export type UserData = {
  id: IUser["_id"];
  email: IUser["email"];
  username: IUser["username"];
  nickname?: IUser["nickname"];
  biography?: IUser["biography"];
  avatar?: IUser["avatar"];
  blogs?: {
    id: string;
    title: string;
    address: string;
  }[];
};
