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
  router.get("/member/all", getAllMember);
  router.get("/member/find/:id", findMember);
  router.post("/member/create", auth, createMember);
  router.put("/member/update/:id", auth, updateMember);
  router.delete("/member/delete/:id", auth, deleteMember);
};
