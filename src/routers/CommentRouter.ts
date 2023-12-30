import { Router } from "express";
import { getAllCommentByMemberId, createComment } from "../controllers/CommetController";

export default(router: Router) => {
    router.get("/comment/:memberId", getAllCommentByMemberId)
    router.post("/comment/create", createComment)
}