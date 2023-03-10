import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "src/models/user";
import { AUTH, JWT_SECRET } from "src/settings/constants";
import parseError from "src/utils/parseError";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-auth");
    if (!token) throw new Error(AUTH.MISSING_TOKEN);

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (decoded.exp && Date.now() > decoded.exp * 1000) {
      throw new Error(AUTH.EXPIRED_TOKEN);
    }

    const user = await User.findById(decoded.id);
    if (!user) throw new Error(AUTH.INVALID_TOKEN);

    req.body.authUser = user.mapToUserData();
    next();
  } catch (err: any) {
    res.status(403).json(parseError(err));
  }
};

export default authenticate;
