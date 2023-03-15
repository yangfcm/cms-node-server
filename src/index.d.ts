import { UserData } from "./dtos/user";
import { BlogData } from "./dtos/blog";

declare module "express-serve-static-core" {
  interface Request {
    blog?: BlogData;
    user?: UserData;
  }
}
