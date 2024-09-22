import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req?.headers || undefined;
  const token: string = authorization?.split(" ")[1] || "";
  try {
    const verify = jwt.verify(token, process.env?.JWT_SECRET as string);
    if (!verify) res.status(401).json({ message: "Unauthorized" });
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
