import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  findEvent,
  getAllEvent,
  getAllEventAndGallery,
  updateEvent,
} from "../controllers/EventController";
import {auth} from "../middleware"
export default (router: Router) => {
  router.route("/event").get(getAllEvent).post(auth,createEvent);
  router.get("/event-and-gallery", getAllEventAndGallery)
  router.route("/event/:id").get(findEvent).put(auth, updateEvent).delete(auth,deleteEvent);
};
