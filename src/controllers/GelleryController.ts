import { Request, Response } from "express";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";

import { prisma } from "../lib/prisma";
import { storage } from "../lib/firebase";

import { generateString, uploadImage } from "../helper";

export const getAllGalleryByEventId = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const result = await prisma.gallery.findMany({
      where: {
        eventId,
      },
    });
    const galleries = await Promise.all(
      result.map(async (gallery) => {
        const imageUrl = await getDownloadURL(ref(storage, gallery.image));
        return {
          ...gallery,
          image: imageUrl,
        };
      })
    );
    res.status(200).send(galleries);
  } catch (error) {
    console.log("[GET_GALLERY] " + error);
    res.sendStatus(400);
  }
};

export const createGallery = async (req: Request, res: Response) => {
  try {
    const [image] = req.files as Express.Multer.File[];
    if (!image) {
      return res.status(400).send({ message: "Image required" });
    }

    const imageUrl = await uploadImage(
      image as Express.Multer.File,
      `${process.env.FIREBASE_FOLDER_GALLERY}/${generateString(8)}.jpg`
    );
    const result = await prisma.gallery.create({
      data: {
        ...req.body,
        image: imageUrl
      },
    });
    res.status(200).send(result);
  } catch (error) {
    console.log("[POST_GALLERY] " + error);
    res.sendStatus(500);
  }
};

export const updateGallery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "id Required" });
    }

    const { file: image } = req;
    let oldImage, newImage;

    if (image) {
      const oldGallery = await prisma.gallery.findFirst({
        where: {
          id,
        },
      });
      oldImage = oldGallery?.image;

      newImage = uploadImage(
        image as Express.Multer.File,
        `${process.env.FIREBASE_FOLDER_GALLERY}/${generateString(8)}.jpg`
      );
    }

    const result = await prisma.gallery.update({
      where: {
        id,
      },
      data: {
        ...req.body,
        image: newImage || oldImage,
      },
    });
    return res.status(200).send(result);
  } catch (error) {
    console.log("[PUT_GALLERY] " + error);
    res.sendStatus(500);
  }
};

export const deleteGallery = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "id Required" });
    }
    const oldGallery = await prisma.gallery.findFirst({
      where: {
        id,
      },
    });

    if (oldGallery?.image) {
      const oldImageRef = ref(storage, oldGallery.image);
      await deleteObject(oldImageRef);
    }

    const result = await prisma.gallery.delete({
      where: {
        id,
      },
    });

    return res.status(200).send(result);
  } catch (error) {
    console.log("[DELETE_GALLERY] " + error);
    res.sendStatus(500);
  }
};
