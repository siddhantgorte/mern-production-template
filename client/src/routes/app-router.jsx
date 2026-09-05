import { Navigate, Route, Routes, useNavigate } from "react-router-dom"

import { LoginPage } from "@/components/auth/login-page"
import ProtectedRoute from "./protected-route.jsx"
import authClient from "@/lib/auth-client.js"
import { Button } from "@/components/ui/button"

const Dashboard = () => {
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await authClient.signOut()
        navigate("/login")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-md p-8 bg-card border rounded-2xl shadow-sm text-center space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    You are securely authenticated via Google OAuth.
                </p>
                <Button variant="destructive" onClick={handleSignOut} className="w-full">
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    )
}

export default AppRouter
