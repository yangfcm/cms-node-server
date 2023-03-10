import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../settings/constants";

function generateAuthToken(user: { id: string; email: string }) {
  const token = jwt.sign(user, JWT_SECRET, {
    expiresIn: "7 days",
  });
  return token;
}

export default generateAuthToken;
