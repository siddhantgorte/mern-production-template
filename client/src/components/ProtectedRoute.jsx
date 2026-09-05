import { Navigate, Outlet } from "react-router-dom"

import { authClient } from "../lib/auth-client"

const ProtectedRoute = () => {
    const { data: session, isPending } = authClient.useSession()

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />

                    <p className="text-sm text-slate-400">
                        Checking authentication...
                    </p>
                </div>
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
