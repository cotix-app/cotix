import { supabase } from "./supabase";

let channel: any = null;

export function startRealtimePresupuestos() {

  if (channel) return;

  channel = supabase
    .channel("cotix-presupuestos")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "presupuestos"
      },
      
      () => {

        console.log("Realtime update recibido");

        window.dispatchEvent(
          new Event("cotix-refresh")
        );

      }
    )

    .subscribe((status) => {

      console.log("Realtime status:", status);

      if (status === "CHANNEL_ERROR") {

        console.log("Reconectando realtime...");

        setTimeout(() => {
          startRealtimePresupuestos();
        }, 2000);

      }

    });

}