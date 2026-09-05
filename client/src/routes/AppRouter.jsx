import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "../components/ProtectedRoute"
import DashboardPage from "../pages/DashboardPage"
import LandingPage from "../pages/LandingPage"
import LoginPage from "../pages/LoginPage"

const AppRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<LandingPage />}
            />

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/dashboard"
                    element={<DashboardPage />}
                />
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    )
}

export default AppRouter
