import { Router } from "express";
import AuthenticationRouter from "./AuthenticationRouter";
import MemberRoute from "./MemberRoute";
import ChatRouter from "./ChatRouter";
import EventRouter from "./EventRouter";
import GalleryRouter from "./GelleryRouter"
const router = Router()

export default (): Router => {
    AuthenticationRouter(router)
    MemberRoute(router)
    ChatRouter(router)
    EventRouter(router)
    GalleryRouter(router)
    return router
}