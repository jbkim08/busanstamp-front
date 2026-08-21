import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthInitializer from "./components/auth/AuthInitializer.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, //30초 동안에는 같은 요청을 하지 않음
      retry: 1, //실패시 1번 더 다시 시도
      refetchOnWindowFocus: false, //화면을 다른데 다녀와도 자동 요청을 하지 않음
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
