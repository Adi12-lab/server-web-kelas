import { Request, Response } from "express";
import { ref, deleteObject, getDownloadURL } from "firebase/storage";
import { Prisma } from "@prisma/client";

import { prisma } from "../lib/prisma";
import { storage } from "../lib/firebase";
import { generateString, uploadImage } from "../helper";

export const getAllMember = async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const page = Number(req.query.page) || 0;
    const search = req.query.search?.toString()

    let queryOptions = {
      skip: page,
      take: pageSize + 1,
      orderBy: {
        name: Prisma.SortOrder.asc,
      },
      where: search ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive
        },
      } : undefined,
    };
    // const queryAdvance = Prisma.validator<Prisma.MemberFindManyArgs>()(queryOptions)
    
    const result = await prisma.member.findMany(queryOptions);

    let nextPage = null;

    if(result.length > pageSize) {
      nextPage = page + pageSize
      result.pop()
    }
    
    const members = await Promise.all(
      result.map(async (member) => {
        const imageUrl = await getDownloadURL(ref(storage, member.image));
        const backgorundImageUrl = await getDownloadURL(
          ref(storage, member.background_image)
        );
        return {
          ...member,
          image: imageUrl,
          background_image: backgorundImageUrl,
        };
      })
    );

     return res.status(200).send({result: members, nextPage});
  } catch (error) {
    console.log("[GET_MEMBER] " + error);
    return res.sendStatus(500);
  }
};

export const getAllMemberWithoutImage = async (req: Request, res: Response) => {
  try {
    const result = await prisma.member.findMany()
    return res.status(200).send(result)
  } catch (error) {
    console.log("[GET_MEMBER] " + error);
    return res.sendStatus(500);
  }
}



export const findMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await prisma.member.findFirst({
      where: {
        id,
      },
    });
    
    if (result) {
      result.image = await getDownloadURL(ref(storage, result?.image));
      result.background_image = await getDownloadURL(
        ref(storage, result?.background_image)
      );
    }
    return res.status(200).send(result);
  } catch (error) {
    console.log("[GET_MEMBER] " + error);
    return res.sendStatus(400);
  }
};

export const findMemberBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const result = await prisma.member.findFirst({
      where: {
        slug,
      },
    });

    if (result) {
      result.image = await getDownloadURL(ref(storage, result?.image));
      result.background_image = await getDownloadURL(
        ref(storage, result?.background_image)
      );
    }

    return res.status(200).send(result);
  } catch (error) {
    console.log("[GET_MEMBER] " + error);
    return res.sendStatus(400);
  }
};

export const createMember = async (req: Request, res: Response) => {
  try {
    const [image, background_image] = req.files as Express.Multer.File[];

    const imageUrl = await uploadImage(
      image,
      `${process.env.FIREBASE_FOLDER_MEMBER}/image/${generateString(8)}.jpg`
    );
    const backgorundImageUrl = await uploadImage(
      background_image,
      `${process.env.FIREBASE_FOLDER_MEMBER}/background_image/${generateString(
        8
      )}.jpg`
    );

    const result = await prisma.member.create({
      data: {
        ...req.body,
        image: imageUrl,
        background_image: backgorundImageUrl,
      },
    });

    return res.status(200).send(result);
  } catch (error) {
    console.log("[POST_MEMBER] " + error);
    return res.sendStatus(400);
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    let image, background_image;

    for (const file of files) {
      //bisa saja salah satu gambar saja yang di update
      if (file.fieldname === "image") {
        image = file;
      } else if (file.fieldname === "background_image") {
        background_image = file;
      }
    }

    if (!id) {
      return res.status(400).send({ error: "id Required" });
    }

    //jika ada gambar baru atau background baru, maka query lagi

    let oldImage, oldBackgroundImage, newImage, newBackgroundImage;
    if (image || background_image) {
      const oldMember = await prisma.member.findFirst({
        where: {
          id,
        },
      });

      oldImage = oldMember?.image;
      oldBackgroundImage = oldMember?.background_image;

      //jika ada image baru dari request maka hapus gambar lama di firebase
      if (image) {
        if (oldMember?.image) {
          const oldImageRef = ref(storage, oldMember.image);
          await deleteObject(oldImageRef);
        }
        newImage = await uploadImage(
          image,
          `${process.env.FIREBASE_FOLDER_MEMBER}/image/${generateString(8)}.jpg`
        );
      }

      //jika ada backgorund image dari request maka hapus gambar lama di firebase
      if (background_image) {
        if (oldMember?.background_image) {
          const oldImageRef = ref(storage, oldMember.background_image);
          await deleteObject(oldImageRef);
        }
        newBackgroundImage = await uploadImage(
          background_image,
          `${
            process.env.FIREBASE_FOLDER_MEMBER
          }/background_image/${generateString(8)}.jpg`
        );
      }
    }

    const result = await prisma.member.update({
      where: {
        id,
      },
      data: {
        ...req.body,
        image: newImage || oldImage,
        background_image: newBackgroundImage || oldBackgroundImage,
      },
    });
    return res.status(200).send(result);
  } catch (error) {
    console.log("[PUT_MEMBER] " + error);
    return res.sendStatus(400);
  }
};

export const deleteMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "id Required" });
    }

    const oldMember = await prisma.member.findFirst({
      where: {
        id,
      },
    });

    if (oldMember?.image) {
      const oldImageRef = ref(storage, oldMember.image);
      await deleteObject(oldImageRef);
    }

    if (oldMember?.background_image) {
      const oldImageRef = ref(storage, oldMember.background_image);
      await deleteObject(oldImageRef);
    }

    const result = await prisma.member.delete({
      where: {
        id,
      },
    });

    return res.status(200).send(result);
  } catch (error) {
    console.log("[DELETE_MEMBER] " + error);
    return res.sendStatus(400);
  }
};
