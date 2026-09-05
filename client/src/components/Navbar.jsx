import { LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { authClient } from "../lib/auth-client"

const Navbar = () => {
    const navigate = useNavigate()

    const {
        data: session,
        isPending
    } = authClient.useSession()

    const user = session?.user

    const handleSignOut = async () => {
        try {
            await authClient.signOut()

            navigate("/login", {
                replace: true
            })
        } catch (error) {
            console.error("Sign out failed:", error)
        }
    }

    const userInitial =
        user?.name?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        "U"

    return (
        <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link
                    to="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">
                        M
                    </div>

                    <span className="text-lg font-semibold tracking-tight text-white">
                        MERN Template
                    </span>
                </Link>

                {!isPending && user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="h-9 w-9 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
                                    {userInitial}
                                </div>
                            )}

                            <div className="hidden max-w-48 md:block">
                                <p className="truncate text-sm font-medium text-white">
                                    {user.name || "User"}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                ) : !isPending ? (
                    <Link
                        to="/login"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                        Sign In
                    </Link>
                ) : null}
            </nav>
        </header>
    )
}

export default Navbar
