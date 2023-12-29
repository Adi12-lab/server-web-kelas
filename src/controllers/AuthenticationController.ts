import { Request, Response } from "express";
import bcrypt from "bcrypt"

import { prisma } from "../client";
import { comparePassword, generateAccessToken } from "../helper";

export const login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.sendStatus(400);
      }
  
      const user = await prisma.user.findFirst({
        where: {
            username
        },
      })
  
      if (!user) {
        return res.status(400).send("User belum teregistrasi");
      }
      const isPasswordMatch = await comparePassword(password, user.password);
      //cek password apakah sesuai
      if(!isPasswordMatch) {
        res.status(401).send("Password salah");
      }

      //buat payloadnya
      const payload = {
        username: user.username,
        accessToken: generateAccessToken(user)
      }
  
      return res.status(200).send(payload);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
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
            username
        }
      });
    
      if (existingUser) {
        return res.sendStatus(400);
      }
      const hashedPassword = await bcrypt.hash(password, 10) //berapa laam mengenkripsi
      const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword
        }
      })

      return res.status(200).send(user);
    } catch (error) {
      console.log(`[REGISTER] ${error}`);
      return res.sendStatus(400);
    }
  }