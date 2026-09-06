import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import ErrorBoundary from "./components/ErrorBoundary"
import queryClient from "./lib/query-client"
import AppRouter from "./routes/AppRouter"

const App = () => {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <Toaster position="top-right" richColors theme="dark" closeButton />
                <AppRouter />
            </QueryClientProvider>
        </ErrorBoundary>
    )
}

export default App
