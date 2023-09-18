import { Request, Response, NextFunction } from "express";
import parseError from "../utils/parseError";

const catchError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedError = parseError(err);
  let statusCode: number;
  switch (err.name) {
    case "ValidationError":
      statusCode = 400;
      break;
    default:
      statusCode = 500;
  }
  res.status(statusCode).json(parsedError);
};

export default catchError;
