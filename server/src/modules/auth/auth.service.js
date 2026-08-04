import { clerkClient } from "@clerk/express";

const getClerkUser = async (clerkId) => {
    return await clerkClient.users.getUser(clerkId)
}

export {
    getClerkUser
}