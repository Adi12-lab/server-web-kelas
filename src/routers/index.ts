import { Router } from "express";
import AuthenticationRouter from "./AuthenticationRouter";
import MemberRoute from "./MemberRoute";
import CommentRouter from "./CommentRouter";
const router = Router()

export default (): Router => {
    AuthenticationRouter(router)
    MemberRoute(router)
    CommentRouter(router)
    return router
}