import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { readUserById } from "../repositories/user";
import { AUTH, JWT_SECRET } from "../settings/constants";
import parseError from "../utils/parseError";

/**
 * authenticate: read token from request header and pass the user data to next handler.
 * @param req
 * @param res
 * @param next
 */
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

    const user = await readUserById(decoded.id);
    if (!user) throw new Error(AUTH.INVALID_TOKEN);

    req.user = user;
    next();
  } catch (err: any) {
    res.status(403).json(parseError(err));
  }
};

export default authenticate;
