import React from "react"
import ReactDom from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { BrowserRouter } from "react-router-dom"

import AuthProvider from "./context/auth"
import App from "./App"

import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 20 } },
})

ReactDom.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
)
