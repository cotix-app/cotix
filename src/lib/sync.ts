import { supabase } from "./supabase";

export async function syncPresupuestos() {

  try {

    const presupuestos = JSON.parse(
      localStorage.getItem("cotixPresupuestos") || "[]"
    );

    const pendientes = presupuestos.filter((p: any) => !p.synced);

    for (const p of pendientes) {

      if (!p?.data?.cliente) continue;

      const { error } = await supabase
        .from("presupuestos")
        .insert({
          id: p.id,
          cliente_nombre: p.data.cliente.nombre || "",
          cliente_telefono: p.data.cliente.telefono || "",
          equipo_tipo: p.data.activo?.tipo || "",
          problemas: p.data.problemas || [],
          tareas: p.data.tareas || [],
          total: (p.data.tareas || []).reduce(
            (sum: number, t: any) => sum + Number(t.precio || 0),
            0
          )
        });

      if (!error) {
        p.synced = true;
      }

    }

    localStorage.setItem(
      "cotixPresupuestos",
      JSON.stringify(presupuestos)
    );

  } catch (err) {
    console.error("Error en syncPresupuestos:", err);
  }

}