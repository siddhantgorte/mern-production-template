import User from "./user.model.js"

const getUserByAuthId = async (authUserId) => {
    return await User.findOne({ authUserId })
}

const createUser = async (userData) => {
    return await User.create(userData)
}

const getOrCreateUser = async (authUser) => {
    let user = await getUserByAuthId(authUser.id)

    if (user) {
        return user
    }

    return await createUser({
        authUserId: authUser.id,
        name: authUser.name,
        email: authUser.email
    })
}

const updateUser = async (authUserId, userData) => {
    return await User.findOneAndUpdate(
        { authUserId },
        userData,
        {
            new: true,
            runValidators: true
        }
    )
}

const deleteUser = async (authUserId) => {
    return await User.findOneAndDelete({ authUserId })
}

export {
    getUserByAuthId,
    getOrCreateUser,
    createUser,
    updateUser,
    deleteUser
}
