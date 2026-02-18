import {Router} from "express";
import {userRoutes} from "./user.routes.ts";

export const apiRouter = Router()

apiRouter.use("/me", userRoutes)