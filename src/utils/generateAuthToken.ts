import jwt from "jsonwebtoken";
import { JWT_SECRET, ONE_DAY_IN_SECONDS } from "../settings/constants";

function generateAuthToken(user: { id: string; email: string }) {
  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: ONE_DAY_IN_SECONDS,
  });
  const expiresAt = Date.now() + ONE_DAY_IN_SECONDS * 1000;
  return { token, expiresAt };
}

export default generateAuthToken;
