import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, useNavigate } from "react-router-dom"

import { AuthProvider } from "@better-auth-ui/react"

import App from "./App.jsx"
import authClient from "./lib/auth-client.js"
import "./index.css"

const AuthProviderWrapper = ({ children }) => {
    const navigate = useNavigate()

    return (
        <AuthProvider
            authClient={authClient}
            navigate={navigate}
        >
            {children}
        </AuthProvider>
    )
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProviderWrapper>
                <App />
            </AuthProviderWrapper>
        </BrowserRouter>
    </StrictMode>
)
