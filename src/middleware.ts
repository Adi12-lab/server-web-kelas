import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({
      code: "AUTHENTICATION_TOKEN_MISSING",
      message: "Authentication Token Missing"
    })
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY as string);
    return next();
  } catch {
    return res.status(401).clearCookie("access_token").send({
      code: "WRONG_AUTHENTICATION_TOKEN",
      message: "Wrong Authentication Token"
    })
    
  }
}
