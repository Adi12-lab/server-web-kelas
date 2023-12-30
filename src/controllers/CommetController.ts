import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllCommentByMemberId = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;
    const result = await prisma.comment.findMany({
      where: {
        memberId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).send(result);
  } catch (error) {
    console.log("[GET_COMMENT] " + error);
    res.sendStatus(400);
  }
};

export const createComment = async (req: Request, res: Response) => {
    try {
        const result = await prisma.comment.create({
            data: {
                ...req.body
            }
        })
        res.status(200).send(result)
    } catch(error) {
        console.log("[POST_COMMENT] "+error)
        res.sendStatus(400)
    }
}