import { Router } from "express";
import { getAllCommentByMemberId, createComment } from "../controllers/CommetController";

export default(router: Router) => {
    router.get("/member/:memberId/comment", getAllCommentByMemberId)
    router.post("/comment", createComment)
}