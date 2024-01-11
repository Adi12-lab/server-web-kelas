import { Router } from "express";
import { register, login, logout, isAuth, isNotAuth } from "../controllers/AuthenticationController";
import { auth } from "../middleware";

export default (router: Router) => {
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post("/auth/logout", auth,logout)
    router.post("/auth/is-auth", isAuth)
    router.post("/auth/is-not-auth", isNotAuth)
  };
