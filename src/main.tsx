import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CotixProvider } from "./context/CotixContext";
import "./index.css";

import { registerSW } from "virtual:pwa-register";

import AppBoot from "./components/AppBoot";

window.addEventListener("offline", () => {
  window.dispatchEvent(new Event("cotix-offline"));
});

window.addEventListener("online", () => {
  window.dispatchEvent(new Event("cotix-online"));
});

registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event("cotix-update"));
  },
  onOfflineReady() {
    console.log("Cotix lista para uso offline");
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <CotixProvider>
        <AppBoot>
          <App />
        </AppBoot>
      </CotixProvider>
    </BrowserRouter>
  </React.StrictMode>
);