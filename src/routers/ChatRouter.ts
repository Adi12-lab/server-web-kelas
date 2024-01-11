import { Router } from "express";
import { getAllChat, createChat} from "../controllers/ChatController";

export default(router: Router) => {
    router.route("/chat").get(getAllChat).post(createChat)
}