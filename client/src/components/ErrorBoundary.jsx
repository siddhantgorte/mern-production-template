import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import React, { Component } from "react"

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
                    <div className="w-full max-w-md rounded-2xl border border-red-900/50 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur sm:p-10">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 text-red-400 border border-red-800/60">
                            <AlertTriangle className="h-7 w-7" />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
                            Something went wrong
                        </h1>

                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                            An unexpected application error occurred. You can try refreshing the page or navigating back to the home screen.
                        </p>

                        {import.meta.env.DEV && this.state.error?.message && (
                            <div className="mt-4 rounded-lg bg-slate-950 p-3 text-left text-xs font-mono text-red-300 border border-slate-800 overflow-x-auto">
                                {this.state.error.message}
                            </div>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={this.handleReset}
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                            >
                                <RotateCcw className="h-4 w-4" />
                                <span>Try Again</span>
                            </button>

                            <a
                                href="/"
                                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                            >
                                <Home className="h-4 w-4" />
                                <span>Back to Home</span>
                            </a>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
