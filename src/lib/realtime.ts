import { supabase } from "./supabase";

export function startRealtimePresupuestos() {

  const channel = supabase
    .channel("presupuestos-changes")

    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "presupuestos"
      },

      () => {

        // Avisar a la app que hay cambios
        window.dispatchEvent(
          new Event("cotix-refresh")
        );

      }
    )

    .subscribe();

  return channel;

}