import { Router } from "express";
import AuthenticationRouter from "./AuthenticationRouter";
import MemberRoute from "./MemberRoute";
import CommentRouter from "./CommentRouter";
import EventRouter from "./EventRouter";
import GalleryRouter from "./GelleryRouter"
const router = Router()

export default (): Router => {
    AuthenticationRouter(router)
    MemberRoute(router)
    CommentRouter(router)
    EventRouter(router)
    GalleryRouter(router)
    return router
}