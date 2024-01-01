import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvent,
  updateEvent,
} from "../controllers/EventController";
import {auth} from "../middleware"
export default (router: Router) => {
  router.route("/event").get(getAllEvent).post(auth,createEvent);
  router.route("/event/:id").put(auth, updateEvent).delete(auth,deleteEvent);
};
