import { Router } from "express";
import { createGallery, updateGallery, deleteGallery, getAllGalleryByEventId } from "../controllers/GelleryController";
import { auth } from "../middleware";

export default (router: Router) => {
    router.get("/event/:eventId/gallery", getAllGalleryByEventId)
    router.post("/gallery",auth ,createGallery);
    router.route("/gallery/:id").put(auth,updateGallery).delete(auth,deleteGallery);
}