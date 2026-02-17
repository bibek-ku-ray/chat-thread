import express from "express"
import helmet from "helmet";
import cors from "cors"
import {errorHandler} from "./middlewares/errorHandler.ts";

export function createApp() {
    const app = express()

    app.use(helmet())
    app.use(cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    }))

    app.use(express.json())
    app.use(errorHandler)

    return app
}