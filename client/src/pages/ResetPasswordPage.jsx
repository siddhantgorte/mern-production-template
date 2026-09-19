import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Lock } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { authClient } from "../lib/auth-client"

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") || ""
    const errorParam = searchParams.get("error") || ""

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!token) {
            setError("Invalid or missing password reset token. Please request a new link.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        try {
            setIsSubmitting(true)

            const { error: resetError } = await authClient.resetPassword({
                newPassword: password,
                token
            })

            if (resetError) {
                const message = resetError.message || "Failed to reset password. The link may have expired or already been used."
                setError(message)
                toast.error(message)
                setIsSubmitting(false)
                return
            }

            setIsSuccess(true)
            toast.success("Password reset successfully!")
            setTimeout(() => {
                navigate("/login", { replace: true })
            }, 2000)
        } catch (err) {
            console.error("Password reset error:", err)
            const message = "Something went wrong. Please try again."
            setError(message)
            toast.error(message)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                </Link>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20 sm:p-10">
                    <div className="flex justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-950">
                            <KeyRound className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Set new password
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Enter a new password for your account.
                        </p>
                    </div>

                    {!token || errorParam ? (
                        <div className="mt-6 rounded-xl border border-amber-900/50 bg-amber-950/40 p-5 text-center">
                            <p className="text-sm font-medium text-amber-300">
                                {errorParam === "INVALID_TOKEN"
                                    ? "This password reset link is invalid or has expired."
                                    : "No valid reset token found in URL."}
                            </p>
                            <p className="mt-1.5 text-xs text-amber-400/80">
                                Please request a new password reset link from the login page.
                            </p>
                            <Link
                                to="/login"
                                className="mt-4 inline-flex items-center justify-center rounded-lg bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 border border-amber-400/20 hover:bg-amber-400/20 transition"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : isSuccess ? (
                        <div className="mt-8 flex flex-col items-center text-center">
                            <CheckCircle className="h-12 w-12 text-emerald-400" />
                            <h2 className="mt-4 text-lg font-semibold text-white">Password Updated!</h2>
                            <p className="mt-1 text-xs text-slate-400">Redirecting you to login page...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div
                                    role="alert"
                                    className="mt-6 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                                >
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300">
                                        New Password
                                    </label>
                                    <div className="relative mt-1.5">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300">
                                        Confirm New Password
                                    </label>
                                    <div className="relative mt-1.5">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isSubmitting}
                                            className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 disabled:opacity-60"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full cursor-pointer rounded-xl bg-white py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-900" />
                                            <span>Updating password...</span>
                                        </>
                                    ) : (
                                        <span>Reset Password</span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ResetPasswordPage
