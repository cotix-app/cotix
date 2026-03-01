//import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CotixProvider } from "./context/CotixContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
<BrowserRouter>
  <CotixProvider>
    <App />
  </CotixProvider>
</BrowserRouter> 
);