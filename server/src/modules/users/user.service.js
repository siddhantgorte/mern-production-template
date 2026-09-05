const getCurrentUser = async (session) => {
    return session.user
}

export default {
    getCurrentUser
}
