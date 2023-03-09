import mongoose from "mongoose";

import { IUser } from "../models/user";

export type UserSignupData = {
  email: IUser["email"];
  username: IUser["username"];
  nickname?: IUser["nickname"];
  password: IUser["password"];
};

export type UserSigninData = {
  email: IUser["email"];
  password: IUser["password"];
};

export type UserData = {
  id: IUser["_id"];
  username: IUser["username"];
  nickname?: IUser["nickname"];
  biography?: IUser["biography"];
  avatar?: IUser["avatar"];
};
