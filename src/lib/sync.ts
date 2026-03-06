import { supabase } from "./supabase";
import { getUser } from "./auth";

export async function syncPresupuestos() {

  try {

    const presupuestos = JSON.parse(
      localStorage.getItem("cotixHistorial") || "[]"
    );

    const pendientes = presupuestos.filter((p:any) => !p.synced);

    if (pendientes.length === 0) return;

    const user = await getUser();

    for (const p of pendientes) {

      if (!p?.data?.cliente) continue;

      const total = (p.data.tareas || []).reduce(
        (sum:number, t:any) => sum + Number(t.precio || 0),
        0
      );

      const { error } = await supabase
        .from("presupuestos")
        .upsert({
          id: p.id,
          tecnico_mail: user?.email,
          cliente_nombre: p.data.cliente.nombre || "",
          cliente_telefono: p.data.cliente.telefono || "",
          equipo_tipo: p.data.activo?.tipo || "",
          problemas: p.data.problemas || [],
          tareas: p.data.tareas || [],
          total: total,
          estado: p.estado || "pendiente",
          fecha: p.fecha || new Date().toISOString()
        });

      if (!error) {
        p.synced = true;
      }

    }

    localStorage.setItem(
      "cotixHistorial",
      JSON.stringify(presupuestos)
    );

  } catch (err) {

    console.error("Error en syncPresupuestos:", err);

  }

}