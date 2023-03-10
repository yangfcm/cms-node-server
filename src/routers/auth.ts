import { Router, Request, Response } from "express";

import { UserSignupData, UserSigninData, UserData } from "../dtos/user";
import { createUser, findUserByCredentials } from "../repositories/user";
import parseError, { APIError } from "../utils/parseError";
import generateAuthToken from "../utils/generateAuthToken";
import { AUTH } from "../settings/constants";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Auth router is working.");
});

router.post(
  "/signup",
  async (
    req: Request<any, any, UserSignupData>,
    res: Response<UserData | APIError>
  ) => {
    try {
      const user = await createUser(req.body);
      const token = generateAuthToken(user);
      res.header("x-auth", token).json(user);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.post(
  "/signin",
  async (
    req: Request<any, any, UserSigninData>,
    res: Response<UserData | APIError>
  ) => {
    try {
      const user = await findUserByCredentials(req.body);
      if (!user) {
        return res.status(403).json({ message: AUTH.BAD_CREDENTIALS });
      }
      const token = generateAuthToken(user);
      res.header("x-auth", token).json(user);
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

export default router;
