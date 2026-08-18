import { Navigate, Outlet } from "react-router-dom"
import { useSession } from "@better-auth-ui/react"

import authClient from "../lib/auth-client.js"

const ProtectedRoute = () => {
    const { data: session, isPending } = useSession(authClient)

    if (isPending) {
        return <p>Loading...</p>
    }

    if (!session?.user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
