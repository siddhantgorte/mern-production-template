import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes fresh cache
            gcTime: 1000 * 60 * 15,    // 15 minutes garbage collection time
            retry: 1,                 // Retry failed requests once before showing error
            refetchOnWindowFocus: false // Prevents unnecessary re-fetches during tab switching
        }
    }
})

export default queryClient
