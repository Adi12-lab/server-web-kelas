import { Request, Response } from "express";
import { prisma } from "../client";

export const getAllMember = async (req: Request, res: Response) => {
    try {
      const result = await prisma.member.findMany();
      return res.status(200).send(result);
    } catch (error) {
      console.log("[GET_MEMBER] " + error);
      return res.sendStatus(400);
    }
  };

export const createMember = async (req: Request, res: Response) => {
    try {
        const result = await prisma.member.create({
            data: {
                ...req.body
            }
        })
        return res.status(200).send(result);
    } catch(error) {
        console.log("[POST_MEMBER] " + error);
        return res.sendStatus(400);
      
    }
}