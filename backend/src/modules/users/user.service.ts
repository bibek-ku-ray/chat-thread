import type {User, UserProfile} from "./user.types.ts";
import {clerkClient} from "../../config/clerk.ts";
import {upsertUserFromClerkProfile} from "./user.repository.ts";

async function fetchClerkProfile(clerkUserId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const getFullName =
        (clerkUser.fullName || "") + (clerkUser.lastName ? `${clerkUser.lastName}` : null)

    const fullName = getFullName.trim().length > 0 ? getFullName : null
    const primaryEmail = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId )?? clerkUser.emailAddresses[0]

    const email = primaryEmail?.emailAddress ?? null
    const avatarUrl = clerkUser?.imageUrl ?? null

    return {
        fullName,
        email,
        avatarUrl
    }
}

export async function getUserFromClerk(
    clerkUserId: string
): Promise<UserProfile> {
    const {fullName, email, avatarUrl}  = await fetchClerkProfile(clerkUserId)

    const user = await upsertUserFromClerkProfile({
        clerkUserId,
        displayName: fullName,
        avatarUrl
    })

    return {
        user,
        clerkEmail: email,
        clerkFullName: fullName,
    }
}