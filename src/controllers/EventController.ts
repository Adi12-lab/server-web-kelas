import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getDownloadURL, ref } from "firebase/storage";

import { storage } from "../lib/firebase";
export const getAllEvent = async (req: Request, res: Response) => {
  try {
    const result = await prisma.event.findMany();
    return res.status(200).send(result);
  } catch (error) {
    console.log("[GET_EVENT] " + error);
    return res.sendStatus(500);
  }
};

export const getAllEventAndGallery = async (req: Request, res: Response) => {
  try {
    const result = await prisma.event.findMany({
      include: {
        Gallery: true
      }
    });
    const events = await Promise.all(
      result.map(async (event) => {
        const eventGalleries = await Promise.all(event.Gallery.map(async (gallery) => {
          const imageUrl = await getDownloadURL(ref(storage, gallery.image));
          return {
            ...gallery,
            image: imageUrl
          }
        }))
        return {
          ...event, Gallery: eventGalleries
        }
      })
    )
    return res.status(200).send(events);
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

export const findEvent = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const result = await prisma.event.findUnique({
      where: {
        id
      }
    })
    return res.status(200).send(result)
  } catch(error) {
    console.log("[GET_EVENT] "+error)
    return res.sendStatus(500)

  }
}

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {name, year} = req.body
    const result = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        name, year
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
        return res.sendStatus(500)
    }
}
