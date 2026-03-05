import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CotixProvider } from "./context/CotixContext";
import "./index.css";
import { syncPresupuestos } from "./lib/sync";
import { registerSW } from "virtual:pwa-register";
import AppBoot from "./components/AppBoot";
import { supabase } from "./lib/supabase";
import { startSessionTimeout } from "./lib/sessionTimeout";


// ---- Sync cuando vuelve internet ----
window.addEventListener("online", () => {
  syncPresupuestos();
});

if (navigator.onLine) {
  syncPresupuestos();
}


// ---- Auto login para testers ----
async function autoLogin() {

  const email = localStorage.getItem("cotixUser");

  if (!email) return;

  const { data } = await supabase.auth.getSession();

  if (data.session) return;

}

autoLogin();
startSessionTimeout();


// ---- Eventos online/offline ----
window.addEventListener("offline", () => {
  window.dispatchEvent(new Event("cotix-offline"));
});

window.addEventListener("online", () => {
  window.dispatchEvent(new Event("cotix-online"));
});


// ---- PWA ----
registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new Event("cotix-update"));
  },
  onOfflineReady() {
    console.log("Cotix lista para uso offline");
  }
});


// ---- React ----
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