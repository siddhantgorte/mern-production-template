import User from "./user.model.js"
import { clerkClient } from "@clerk/express"

const getOrCreateUser = async (clerkId) => {
    let user = await User.findOne({ clerkId })

    if (user) {
        return user
    }

    const clerkUser = await clerkClient.users.getUser(clerkId)

    user = await User.create({
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress
    })

    return user
}

const getUserByClerkId = async (clerkId) => {
    return await User.findOne({ clerkId })
}

const createUser = async (userData) => {
    return await User.create(userData)
}

const updateUser = async (clerkId, userData) => {
    return await User.findOneAndUpdate(
        { clerkId },
        userData,
        {
            new: true,
            runValidators: true
        }
    )
}

const deleteUser = async (clerkId) => {
    return await User.findOneAndDelete({ clerkId })
}

export {
    getOrCreateUser,
    getUserByClerkId,
    createUser,
    updateUser,
    deleteUser
}