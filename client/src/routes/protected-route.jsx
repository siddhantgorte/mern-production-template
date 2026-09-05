import { Navigate, Outlet } from "react-router-dom"

import authClient from "../lib/auth-client.js"

const ProtectedRoute = () => {
    const { data: session, isPending } = authClient.useSession()

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        )
    }

    if (!session?.user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute

