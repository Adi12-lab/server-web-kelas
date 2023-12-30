import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY as string);
    return next();
  } catch {
    return res.sendStatus(403);
  }
}
