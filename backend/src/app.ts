import express from "express"
import helmet from "helmet";
import cors from "cors"
import {errorHandler} from "./middlewares/errorHandler.ts";
import {clerkMiddleware} from "./config/clerk.ts";
import {apiRouter} from "./routes";

export function createApp() {
    const app = express()

    app.use(clerkMiddleware())
    app.use(helmet())

    app.use(cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    }))

    app.use(express.json())

    app.use("/api", apiRouter)

    app.use(errorHandler)

    return app
}