import { Request, Response, NextFunction } from "express";

const getBlogByAddress = async (
  req: Request<{ address: string }>,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params.address);
  next();
};

export default getBlogByAddress;
