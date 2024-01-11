import { Router } from "express";
import {
  getAllMember,
  getAllMemberWithoutImage,
  createMember,
  updateMember,
  deleteMember,
  findMember,
  findMemberBySlug
} from "../controllers/MemberController";
import { auth } from "../middleware";

export default (router: Router) => {
  router.route("/member").get(getAllMember).post(auth, createMember);
  router.get("/member-without-image",getAllMemberWithoutImage)
  router.get("/member-by-slug/:slug", findMemberBySlug)
  router
    .route("/member/:id")
    .get(findMember)
    .put(auth, updateMember)
    .delete(auth, deleteMember);
};
