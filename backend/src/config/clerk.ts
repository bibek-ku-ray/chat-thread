import type {NextFunction, Request, Response} from "express";
import {UnauthorizedError} from "../lib/error.ts";
import {clerkMiddleware, clerkClient, getAuth} from "@clerk/express";

export {clerkMiddleware, clerkClient, getAuth}

export function requiredAuthApi(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const auth = getAuth(req)

    if (!auth.userId) {
        return next(
            new UnauthorizedError("You must to signed in to access this resource!")
        )
    }

    return next();
}