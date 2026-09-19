import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { toast } from "sonner"

import { authClient } from "../lib/auth-client"

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token") || ""

    const [status, setStatus] = useState("loading") // "loading" | "success" | "error"
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setErrorMessage("No verification token provided.")
            return
        }

        const verify = async () => {
            try {
                const { error } = await authClient.verifyEmail({
                    query: { token }
                })

                if (error) {
                    setStatus("error")
                    setErrorMessage(error.message || "Failed to verify email. The link may have expired.")
                    toast.error("Email verification failed.")
                } else {
                    setStatus("success")
                    toast.success("Email verified successfully!")
                }
            } catch (err) {
                setStatus("error")
                setErrorMessage("An unexpected error occurred during email verification.")
            }
        }

        verify()
    }, [token])

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur sm:p-10">
                {status === "loading" && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
                        <h1 className="mt-6 text-xl font-bold">Verifying your email...</h1>
                        <p className="mt-2 text-sm text-slate-400">Please wait while we confirm your account.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-14 w-14 text-emerald-400" />
                        <h1 className="mt-6 text-2xl font-bold">Email Verified!</h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Your email address has been successfully verified. You now have full access to your account.
                        </p>
                        <Link
                            to="/login"
                            className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Sign In to Your Account
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-14 w-14 text-red-400" />
                        <h1 className="mt-6 text-2xl font-bold">Verification Failed</h1>
                        <p className="mt-2 text-sm text-red-300">{errorMessage}</p>
                        <Link
                            to="/login"
                            className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VerifyEmailPage
