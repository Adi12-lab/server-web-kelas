import { Router } from "express";
import AuthenticationRouter from "./AuthenticationRouter";
const router = Router()

export default (): Router => {
    AuthenticationRouter(router)
    return router
}