import { ArrowLeft, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { Link, Navigate } from "react-router-dom"

import { authClient } from "../lib/auth-client"

const LoginPage = () => {
    const [error, setError] = useState("")
    const [isSigningIn, setIsSigningIn] = useState(false)

    const { data: session, isPending } = authClient.useSession()
    
    const handleGoogleSignIn = async () => {
        try {
            setError("")
            setIsSigningIn(true)

            const { error: signInError } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`
            })

            if (signInError) {
                setError(
                    signInError.message || "Unable to sign in with Google."
                )
                setIsSigningIn(false)
            }
        } catch (error) {
            console.error("Google sign-in failed:", error)

            setError("Something went wrong. Please try again.")
            setIsSigningIn(false)
        }
    }

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />
            </div>
        )
    }

    if (session) {
        return <Navigate to="/dashboard" replace />
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
            <div className="w-full max-w-md">
                <Link
                    to="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 sm:p-10">
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
                            M
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            Sign in to continue to your dashboard
                        </p>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isSigningIn}
                        className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSigningIn ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                                <span>Redirecting...</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="#4285F4"
                                        d="M21.35 12.27c0-.68-.06-1.34-.17-1.97H12v3.73h5.22a4.46 4.46 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.93-4.18 2.93-7.13Z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 21.75c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.75 9.75 0 0 0 12 21.75Z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M6.53 13.85a5.87 5.87 0 0 1 0-3.7V7.63H3.28a9.76 9.76 0 0 0 0 8.74l3.25-2.52Z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 6.12c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.22 14.63 2.25 12 2.25a9.75 9.75 0 0 0-8.72 5.38l3.25 2.52C7.3 7.84 9.46 6.12 12 6.12Z"
                                    />
                                </svg>

                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-800" />
                        <span className="text-xs text-slate-500">
                            SECURE SIGN-IN
                        </span>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-950/70 p-4">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                        <p className="text-xs leading-5 text-slate-400">
                            Authentication is securely handled by Better Auth
                            and Google. Your application does not store your
                            Google password.
                        </p>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    By continuing, you agree to use this application
                    responsibly.
                </p>
            </div>
        </div>
    )
}

export default LoginPage
