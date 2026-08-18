import { Navigate, Route, Routes } from "react-router-dom"

import { Auth } from "@/components/auth/auth"
import ProtectedRoute from "./protected-route.jsx"

const Dashboard = () => {
    return <h1>Dashboard</h1>
}

const AppRouter = () => {
    return (
            <Routes>
                <Route
                    path="/login"
                    element={<Auth view="signIn" />}
                />

                <Route
                    path="/register"
                    element={<Auth view="signUp" />}
                />

                <Route
                    path="/forgot-password"
                    element={<Auth view="forgotPassword" />}
                />

                <Route
                    path="/reset-password"
                    element={<Auth view="resetPassword" />}
                />

                <Route
                    path="/verify-email"
                    element={<Auth view="verifyEmail" />}
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
