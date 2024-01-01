import { Router } from "express";
import {
  getAllMember,
  createMember,
  updateMember,
  deleteMember,
  findMember,
} from "../controllers/MemberController";
import { auth } from "../middleware";

export default (router: Router) => {
  router.route("/member").get(getAllMember).post(auth, createMember);
  router
    .route("/member/:id")
    .get(findMember)
    .put(auth, updateMember)
    .delete(auth, deleteMember);
};
