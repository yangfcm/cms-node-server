import { UserData } from "./dtos/user";
import { BlogData } from "./dtos/blog";

declare module "express" {
  export interface Request {
    blog?: BlogData;
    user?: UserData;
  }
}
