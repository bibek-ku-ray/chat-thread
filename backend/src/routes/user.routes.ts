import {Router} from "express";
import {getAuth} from "../config/clerk.ts";
import {UnauthorizedError} from "../lib/error.ts";
import {getUserFromClerk, updateUserProfile} from "../modules/users/user.service.ts";
import {toUserProfileResponse, type UserProfile, type UserProfileResponse} from "../modules/users/user.types.ts";
import {z} from "zod";

export const userRoutes = Router()

function toResponse(profile: UserProfile): UserProfileResponse {
    return toUserProfileResponse(profile)
}

const UserProfileUpdaterSchema = z.object({
    displayName: z.string().trim().max(50).optional(),
    handle: z.string().trim().max(30).optional(),
    bio: z.string().trim().max(500).optional(),
    avatarUrl: z.url("Avatar must be valid url").optional()
})

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

userRoutes.patch("/", async (req, res, next) => {
    try {
        const auth = getAuth(req)

        if(!auth.userId) {
            throw new UnauthorizedError("Unauthorized")
        }

        const parsedBody = UserProfileUpdaterSchema.parse(req.body)

        const displayName = parsedBody.displayName && parsedBody.displayName.trim().length > 0
            ? parsedBody.displayName.trim()
            : undefined;

        const handle = parsedBody.handle && parsedBody.handle.trim().length > 0
            ? parsedBody.handle.trim()
            : undefined;

        const bio = parsedBody.bio && parsedBody.bio.trim().length > 0
            ? parsedBody.bio.trim()
            : undefined;

        const avatarUrl = parsedBody.avatarUrl && parsedBody.avatarUrl.trim().length > 0
            ? parsedBody.avatarUrl.trim()
            : undefined;

        try {
            const profile = await updateUserProfile({
                clerkUserId: auth.userId,
                displayName,
                handle,
                bio,
                avatarUrl
            })

            const response = toResponse(profile)

            res.status(201).json({
                data: response
            })
        } catch (err) {
            throw err
        }
    } catch (err) {
        next(err)
    }
})