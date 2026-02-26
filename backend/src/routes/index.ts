import {Router} from "express";
import {userRoutes} from "./user.routes.ts";
import { threadsRouter } from "./threads.routes.ts";

export const apiRouter = Router()

apiRouter.use("/me", userRoutes)
apiRouter.use("/threads", threadsRouter)