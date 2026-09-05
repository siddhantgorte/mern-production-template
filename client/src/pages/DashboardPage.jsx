import {
    Bot,
    Database,
    GitBranch,
    Layers3,
    Server,
    Sparkles
} from "lucide-react"

import Navbar from "../components/Navbar"
import { authClient } from "../lib/auth-client"

const templateFeatures = [
    {
        icon: Server,
        title: "Express Backend",
        description:
            "Modular Express architecture with middleware, REST APIs and centralized error handling."
    },
    {
        icon: Database,
        title: "MongoDB",
        description:
            "Mongoose-powered database connection with a clean foundation for your application data."
    },
    {
        icon: GitBranch,
        title: "REST API",
        description:
            "A structured API layer ready for authentication, business logic and frontend integration."
    },
    {
        icon: Layers3,
        title: "Modular Frontend",
        description:
            "React components, pages, routes, services and utilities organized for maintainability."
    },
    {
        icon: Bot,
        title: "Better Auth",
        description:
            "Google OAuth authentication with secure session management and protected routes."
    },
    {
        icon: Sparkles,
        title: "Tailwind CSS",
        description:
            "Modern responsive UI development using Tailwind CSS and reusable React components."
    }
]

const DashboardPage = () => {
    const { data: session, isPending } = authClient.useSession()

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-white" />
            </div>
        )
    }

    const user = session?.user

    const displayName = user?.name || "User"

    const initial =
        user?.name?.charAt(0).toUpperCase() ||
        user?.email?.charAt(0).toUpperCase() ||
        "U"

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-400">
                                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                                    Dashboard
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                    Welcome, {displayName}
                                </h1>

                                <p className="mt-3 max-w-2xl text-slate-400">
                                    Your MERN Production Template is ready.
                                    Start building your application on top of
                                    this foundation.
                                </p>
                            </div>

                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={displayName}
                                    className="h-20 w-20 rounded-2xl object-cover ring-1 ring-slate-700"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-bold text-white ring-1 ring-slate-700">
                                    {initial}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold">
                            Profile
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Your authenticated account information.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={displayName}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xl font-bold">
                                    {initial}
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-lg font-semibold">
                                    {displayName}
                                </p>

                                <p className="text-sm text-slate-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-10">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold">
                            Template Features
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            The building blocks included in your starter
                            project.
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {templateFeatures.map((feature) => {
                            const Icon = feature.icon

                            return (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/70"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800">
                                        <Icon className="h-5 w-5 text-blue-400" />
                                    </div>

                                    <h3 className="mt-5 font-semibold">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default DashboardPage
