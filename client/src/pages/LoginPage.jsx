import { ArrowLeft, Lock, Mail, ShieldCheck, User } from "lucide-react"
import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { authClient } from "../lib/auth-client"

const LoginPage = () => {
    const navigate = useNavigate()
    const [mode, setMode] = useState("signin") // "signin" | "signup"
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false)

    const { data: session, isPending } = authClient.useSession()

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all required fields.")
            return
        }

        if (mode === "signup" && !name.trim()) {
            setError("Please enter your name.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.")
            return
        }

        try {
            setIsSubmitting(true)

            if (mode === "signup") {
                const { data, error: signUpError } = await authClient.signUp.email({
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    callbackURL: `${window.location.origin}/dashboard`
                })

                if (signUpError) {
                    const message = signUpError.message || "Failed to create account."
                    setError(message)
                    toast.error(message)
                    setIsSubmitting(false)
                    return
                }

                toast.success("Account created successfully!")
                navigate("/dashboard", { replace: true })
            } else {
                const { data, error: signInError } = await authClient.signIn.email({
                    email: email.trim(),
                    password,
                    callbackURL: `${window.location.origin}/dashboard`
                })

                if (signInError) {
                    const message = signInError.message || "Invalid email or password."
                    setError(message)
                    toast.error(message)
                    setIsSubmitting(false)
                    return
                }

                toast.success("Signed in successfully!")
                navigate("/dashboard", { replace: true })
            }
        } catch (err) {
            console.error("Authentication error:", err)
            const message = "Something went wrong. Please try again."
            setError(message)
            toast.error(message)
            setIsSubmitting(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setError("")
            setIsGoogleSigningIn(true)

            const { error: signInError } = await authClient.signIn.social({
                provider: "google",
                callbackURL: `${window.location.origin}/dashboard`
            })

            if (signInError) {
                const message = signInError.message || "Unable to sign in with Google."
                setError(message)
                toast.error(message)
                setIsGoogleSigningIn(false)
            }
        } catch (err) {
            console.error("Google sign-in failed:", err)
            const message = "Something went wrong. Please try again."
            setError(message)
            toast.error(message)
            setIsGoogleSigningIn(false)
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
                            {mode === "signup" ? "Create an account" : "Welcome back"}
                        </h1>

                        <p className="mt-2 text-sm text-slate-400">
                            {mode === "signup"
                                ? "Sign up to start using your dashboard"
                                : "Sign in to continue to your dashboard"}
                        </p>
                    </div>

                    {/* Mode Toggle (Sign In / Sign Up) */}
                    <div className="mt-6 flex rounded-xl bg-slate-950/80 p-1 border border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                setMode("signin")
                                setError("")
                            }}
                            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                                mode === "signin"
                                    ? "bg-slate-800 text-white shadow"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode("signup")
                                setError("")
                            }}
                            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition cursor-pointer ${
                                mode === "signup"
                                    ? "bg-slate-800 text-white shadow"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    {/* Email & Password Form */}
                    <form onSubmit={handleEmailAuth} className="mt-6 space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label className="block text-xs font-medium text-slate-300">
                                    Full Name
                                </label>
                                <div className="relative mt-1.5">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isSubmitting || isGoogleSigningIn}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-slate-300">
                                Email Address
                            </label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting || isGoogleSigningIn}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative mt-1.5">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting || isGoogleSigningIn}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || isGoogleSigningIn}
                            className="w-full cursor-pointer rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                                    <span>{mode === "signup" ? "Creating account..." : "Signing in..."}</span>
                                </>
                            ) : (
                                <span>{mode === "signup" ? "Create Account" : "Sign In with Email"}</span>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-slate-800" />
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="h-px flex-1 bg-slate-800" />
                    </div>

                    {/* Google Sign In Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmitting || isGoogleSigningIn}
                        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isGoogleSigningIn ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-white" />
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

                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-950/70 p-4">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <p className="text-xs leading-5 text-slate-400">
                            Authentication is securely encrypted and managed by Better Auth.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
