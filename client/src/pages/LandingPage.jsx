import {
    ArrowRight,
    Database,
    Layers3,
    ShieldCheck,
    Sparkles,
    Zap
} from "lucide-react"
import { Link } from "react-router-dom"

import Navbar from "../components/Navbar"

const features = [
    {
        icon: ShieldCheck,
        title: "Secure Authentication",
        description:
            "Google authentication powered by Better Auth with secure cookie-based sessions."
    },
    {
        icon: Layers3,
        title: "Modular Architecture",
        description:
            "A clean project structure designed to scale as your application grows."
    },
    {
        icon: Database,
        title: "Production Ready",
        description:
            "MongoDB, REST APIs, validation, middleware, security and error handling."
    },
    {
        icon: Zap,
        title: "Modern Stack",
        description:
            "React, Vite, Tailwind CSS and a Node.js + Express backend."
    }
]

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main>
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
                        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
                    </div>

                    <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-300">
                                <Sparkles className="h-4 w-4 text-blue-400" />
                                <span>Production-ready MERN starter</span>
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                                Build faster.
                                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Scale confidently.
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                                A modern MERN stack foundation with secure
                                authentication, modular architecture, MongoDB,
                                REST APIs and a clean developer experience.
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    to="/login"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                >
                                    Get Started

                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <a
                                    href="#features"
                                    className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
                                >
                                    Explore Features
                                </a>
                            </div>
                        </div>

                        <div className="mx-auto mt-20 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl shadow-black/20">
                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
                                <div className="flex items-center gap-2 border-b border-slate-800 pb-5">
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                    <div className="h-3 w-3 rounded-full bg-slate-700" />
                                </div>

                                <div className="grid gap-6 pt-6 md:grid-cols-3">
                                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                                        <p className="text-sm text-slate-400">
                                            Authentication
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            Better Auth
                                        </p>

                                        <div className="mt-4 h-2 rounded-full bg-slate-800">
                                            <div className="h-2 w-full rounded-full bg-blue-500" />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                                        <p className="text-sm text-slate-400">
                                            Database
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            MongoDB
                                        </p>

                                        <div className="mt-4 h-2 rounded-full bg-slate-800">
                                            <div className="h-2 w-4/5 rounded-full bg-purple-500" />
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                                        <p className="text-sm text-slate-400">
                                            Frontend
                                        </p>

                                        <p className="mt-2 text-lg font-semibold">
                                            React + Vite
                                        </p>

                                        <div className="mt-4 h-2 rounded-full bg-slate-800">
                                            <div className="h-2 w-11/12 rounded-full bg-cyan-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="features"
                    className="border-t border-slate-900 bg-slate-950"
                >
                    <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Everything you need
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                A solid foundation for your next project
                            </h2>

                            <p className="mt-4 text-slate-400">
                                Start with the essentials already configured
                                and focus on building your product.
                            </p>
                        </div>

                        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {features.map((feature) => {
                                const Icon = feature.icon

                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800">
                                            <Icon className="h-5 w-5 text-blue-400" />
                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold">
                                            {feature.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                <section className="border-t border-slate-900">
                    <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to start building?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                            Sign in with Google and start exploring your
                            production-ready MERN application.
                        </p>

                        <Link
                            to="/login"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Continue with Google
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-900">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
                    <p>
                        © {new Date().getFullYear()} MERN Production Template
                    </p>

                    <p>
                        Built with React, Express & MongoDB
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
