import { Router, Request, Response } from "express";

import { UserSignupData, UserData } from "../dtos/user";
import { createUser } from "../repositories/user";

const router = Router();

router.get("/check", (req, res) => {
  res.send("Auth router is working.");
});

router.post(
  "/signup",
  async (
    req: Request<any, any, UserSignupData>,
    res: Response<UserData | { message: string }>
  ) => {
    try {
      const user = await createUser(req.body);
      res.json(user);
    } catch (err: any) {
      res.status(400).send({ message: err.message });
    }
  }
);

export default router;
