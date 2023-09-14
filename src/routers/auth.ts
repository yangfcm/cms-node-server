import { Router, Request, Response } from "express";

import { UserSignupData, UserSigninData, UserData } from "../dtos/user";
import { createUser, findUserByCredentials } from "../repositories/user";
import authenticate from "../middleware/authenticate";
import parseError, { APIError } from "../utils/parseError";
import generateAuthToken from "../utils/generateAuthToken";
import { AUTH } from "../settings/constants";

export type AuthUserResponse = {
  user: UserData;
  token: string;
  expiresAt: number;
};

export type UserResponse = {
  user: UserData;
};

const router = Router();

router.get("/check", (req, res) => {
  res.send("Auth router is working.");
});

router.post(
  "/signup",
  async (
    req: Request<any, any, UserSignupData>,
    res: Response<AuthUserResponse | APIError>
  ) => {
    try {
      const user = await createUser(req.body);
      const { token, expiresAt } = generateAuthToken(user);
      res.json({ user, token, expiresAt });
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.post(
  "/signin",
  async (
    req: Request<any, any, UserSigninData>,
    res: Response<AuthUserResponse | APIError>
  ) => {
    try {
      const user = await findUserByCredentials(req.body);
      if (!user) {
        return res.status(403).json({ message: AUTH.BAD_CREDENTIALS });
      }
      const { token, expiresAt } = generateAuthToken(user);
      res.json({ user, token, expiresAt });
    } catch (err: any) {
      res.status(400).json(parseError(err));
    }
  }
);

router.get(
  "/token",
  authenticate,
  async (req: Request, res: Response<UserResponse | APIError>) => {
    try {
      const { user } = req;
      if (!user) return res.status(403).json({ message: AUTH.INVALID_TOKEN });
      res.json({ user });
    } catch (err: any) {
      res.status(403).json(parseError(err));
    }
  }
);

export default router;
