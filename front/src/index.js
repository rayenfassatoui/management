import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ProjectContextProvider } from "./context/ProjectContext";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ProjectContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ProjectContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
