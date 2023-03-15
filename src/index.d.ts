import { UserData } from "./dtos/user";
import { BlogData } from "./dtos/blog";

export {};

declare global {
  namespace Express {
    export interface Request {
      blog?: BlogData;
      user?: UserData;
    }
  }
}
