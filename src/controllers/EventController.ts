import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllEvent = async (req: Request, res: Response) => {
  try {
    const result = await prisma.event.findMany();
    return res.status(200).send(result);
  } catch (error) {
    console.log("[GET_EVENT] " + error);
    return res.sendStatus(500);
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const result = await prisma.event.create({
      data: {
        ...req.body,
      },
    });
    return res.status(200).send(result);
  } catch (error) {
    console.log("[POST_EVENT] " + error);
    return res.sendStatus(500);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        ...req.body
      },
    });
    return res.status(200).send(result)
  } catch (error) {
    console.log("[PUT_EVENT] " + error);
    return res.sendStatus(500);
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const result = await prisma.event.delete({
            where: {
                id
            }
        })
        return res.status(200).send(result)
    } catch(error) {
        console.log("[DELETE_EVENT] " + error);
    }
}
