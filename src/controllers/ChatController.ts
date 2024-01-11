import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {pusher} from "../lib/pusher"

export const getAllChat = async (req: Request, res: Response) => {
  try {
    const result = await prisma.chat.findMany();
    return res.status(200).send(result);
  } catch (error) {
    console.log("[GET_COMMENT] " + error);
    return res.sendStatus(500);
  }
};

export const createChat = async (req: Request, res: Response) => {
    try {
        const result = await prisma.chat.create({
            data: {
                ...req.body
            }
        })
        pusher.trigger("public-chat", 'incoming-message', result)
        return res.status(200).send(result)
    } catch(error) {
        console.log("[POST_COMMENT] "+error)
        return res.sendStatus(500)
    }
}