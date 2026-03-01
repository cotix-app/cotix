import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CotixProvider } from "./context/CotixContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <CotixProvider>
        <App />
      </CotixProvider>
    </BrowserRouter>
  </React.StrictMode>
);