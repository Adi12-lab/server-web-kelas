import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, {JwtPayload} from "jsonwebtoken"
import { prisma } from "../lib/prisma";
import { comparePassword, generateAccessToken } from "../helper";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.sendStatus(400);
    }

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
	
    if (!user) {
      return res.status(400).send({
        code: "USER_HAS_NOT_REGISTERED",
        message: "User has not registered"
      });
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    //cek password apakah sesuai
    if (!isPasswordMatch) {
      res.status(401).send({
        code: "PASSWORD_NOT_MATCH",
        message: "Password not match"
      });
    }
	
    return res
      .cookie("access_token", generateAccessToken(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 *60 *24,
	sameSite:"none",
	domain: process.env.DOMAIN,
	path: "/"
      })
      .status(200)
      .send({ message: "Login success" });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { password, username } = req.body;

    if (!password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.sendStatus(400);
    }
    const hashedPassword = await bcrypt.hash(password, 10); //berapa laam mengenkripsi
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return res.status(200).send(user);
  } catch (error) {
    console.log(`[REGISTER] ${error}`);
    return res.sendStatus(500);
  }
};

export const logout = (req: Request, res: Response) => {
  return res.clearCookie("access_token", {domain: process.env.DOMAIN, sameSite: "none", path: "/", secure: true, httpOnly: true}).status(200).send({message: "Successfully logged out"})
}


interface UserPayload extends JwtPayload {
  username: string;
}

export function isAuth(req: Request, res: Response) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send({
      code: "AUTHENTICATION_TOKEN_MISSING",
      message: "Authentication Token Missing"
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as UserPayload;
    return res.status(200).send({
      code: "AUTHENTICATION_SUCCESSFULL",
      message: "Authentication Successfull",
      user: decoded.username
    });
  } catch {
    return res.status(401).clearCookie("access_token").send({
      code: "WRONG_AUTHENTICATION_TOKEN",
      message: "Wrong Authentication Token"
    })
    
  }
}


export function isNotAuth(req: Request, res: Response) {
  const token = req.cookies.access_token
  if(token) {//jika ada token
    return res.status(403).send({
      code: "AUTHENTICATED",
      message: "Your are authenticated"
    })
  }
  return res.status(200).send({
    code: "NOT_AUTHENTICATED",
    message: "Your aren authenticated"
  })
}
