import { supabase } from "./supabase";

export async function pullPresupuestos() {
  const { data, error } = await supabase
    .from("presupuestos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error trayendo presupuestos:", error);
    return;
  }

  if (!data) return;

  const adaptados = data.map((p: any) => ({
    id: p.id,
    fecha: p.fecha,
    estado: p.estado,
    data: {
      cliente: {
        nombre: p.cliente_nombre,
        telefono: p.cliente_telefono
      },
      activo: {
        tipo: p.equipo_tipo
      },
      problemas: p.problemas,
      tareas: p.tareas,
      config: {
        empresa: "SERVICIO TÉCNICO",
        mostrarFechaHora: true,
        validezDias: 15
      }
    },
    synced: true
  }));

  localStorage.setItem(
    "cotixHistorial",
    JSON.stringify(adaptados)
  );
}