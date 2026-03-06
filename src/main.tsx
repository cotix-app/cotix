import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CotixProvider } from "./context/CotixContext";
import "./index.css";

import { syncPresupuestos } from "./lib/sync";
import { pullPresupuestos } from "./lib/pullPresupuestos";
import { startRealtimePresupuestos } from "./lib/realtime";

import { registerSW } from "virtual:pwa-register";
import AppBoot from "./components/AppBoot";
import { supabase } from "./lib/supabase";

// ---------- Sync inicial ----------
if (navigator.onLine) {
  syncPresupuestos();
  pullPresupuestos();
}

// ---------- Realtime listener ----------
startRealtimePresupuestos();

// refrescar cuando la app vuelve a foco
window.addEventListener("focus", () => {
  if (navigator.onLine) {
    pullPresupuestos();
  }
});

window.addEventListener("cotix-refresh", () => {
  if (navigator.onLine) {
    pullPresupuestos();
  }
});

// ---------- Sync cuando vuelve internet ----------
window.addEventListener("online", () => {
  syncPresupuestos();
  pullPresupuestos();
  window.dispatchEvent(new Event("cotix-online"));
});

// ---------- Evento offline ----------
window.addEventListener("offline", () => {
  window.dispatchEvent(new Event("cotix-offline"));
});

// ---------- Auto login testers ----------
async function autoLogin() {
  const email = localStorage.getItem("cotixUser");

  if (!email) return;

  const { data } = await supabase.auth.getSession();

  if (data.session) return;
}

autoLogin();

// ---------- PWA ----------
registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event("cotix-update"));
  },
  onOfflineReady() {
    console.log("Cotix lista para uso offline");
  }
});

// ---------- React ----------
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