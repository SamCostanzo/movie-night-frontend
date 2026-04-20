import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { MovieListProvider } from "./contexts/MovieListContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <MovieListProvider>
          <App />
        </MovieListProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
