import {Router} from "express";
import {getAuth} from "../config/clerk.ts";
import {UnauthorizedError} from "../lib/error.ts";
import {getUserFromClerk} from "../modules/users/user.service.ts";
import {toUserProfileResponse, type UserProfile, type UserProfileResponse} from "../modules/users/user.types.ts";

export const userRoutes = Router()

function toResponse(profile: UserProfile): UserProfileResponse {
    return toUserProfileResponse(profile)
}

// GET: /me
userRoutes.get("/", async (req, res, next) => {
    try {
        const auth = getAuth(req)

        if(!auth.userId) {
            throw new UnauthorizedError("Unauthorized")
        }

        const profile = await getUserFromClerk(auth.userId)
        const response = toResponse(profile)

        res.status(200).json({
            data: response
        })
    } catch (err) {
        next(err)
    }
})