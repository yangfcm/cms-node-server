import { Request, Response, NextFunction } from "express";
import parseError, { APIError } from "../utils/parseError";

const catchError = (
  err: any,
  req: Request,
  res: Response<APIError>,
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
