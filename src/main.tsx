import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./store/AuthContext.tsx";
import { NewsProvider } from "./store/NewsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NewsProvider>
          <App />
        </NewsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
