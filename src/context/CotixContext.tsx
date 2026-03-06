import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type CotixData = {
  cliente: { nombre: string; telefono: string };
  activo: { tipo: string };
  problemas: string[];
  tareas: { descripcion: string; detalle?: string; precio: number }[];
  config: {
    empresa: string;
    mostrarFechaHora: boolean;
    validezDias: number;
  };
};

export type Presupuesto = {
  id: string;
  fecha: string;
  estado: string;
  data: CotixData;
  synced?: boolean;
};

type PlanType = "free" | "pro";

type CotixContextType = {
  data: CotixData;
  setData: React.Dispatch<React.SetStateAction<CotixData>>;

  presupuestos: Presupuesto[];
  setPresupuestos: React.Dispatch<React.SetStateAction<Presupuesto[]>>;

  trialInicio: string;
  trialActivo: boolean;
  diasRestantes: number;

  presupuestosHoy: number;
  limiteDiario: number;

  plan: PlanType;
  puedeCrearHoy: boolean;
  registrarCreacionHoy: () => void;
  activarPro: () => void;

  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
};

const CotixContext = createContext<CotixContextType | undefined>(undefined);

export function CotixProvider({ children }: { children: React.ReactNode }) {

  const [plan, setPlan] = useState<PlanType>(() => {
    return (localStorage.getItem("cotixPlan") as PlanType) || "free";
  });

  const [data, setData] = useState<CotixData>(() => {
    const stored = localStorage.getItem("cotixData");

    return stored
      ? JSON.parse(stored)
      : {
          cliente: { nombre: "", telefono: "" },
          activo: { tipo: "" },
          problemas: [],
          tareas: [],
          config: {
            empresa: "SERVICIO TÉCNICO",
            mostrarFechaHora: true,
            validezDias: 15,
          },
        };
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>(() => {
    const stored = localStorage.getItem("cotixHistorial");
    return stored ? JSON.parse(stored) : [];
  });

  const [trialInicio] = useState<string>(() => {
    const stored = localStorage.getItem("cotixTrialInicio");

    if (stored) return stored;

    const hoy = new Date().toISOString();
    localStorage.setItem("cotixTrialInicio", hoy);
    return hoy;
  });

  // ---------- Guardar en localStorage ----------
  useEffect(() => {
    localStorage.setItem("cotixData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("cotixHistorial", JSON.stringify(presupuestos));
  }, [presupuestos]);

  useEffect(() => {
    localStorage.setItem("cotixPlan", plan);
  }, [plan]);

  // ---------- 🔥 REALTIME REFRESH ----------
  useEffect(() => {

    const handler = async () => {

      try {

        const { data: rows } = await supabase
          .from("presupuestos")
          .select("*")
          .order("fecha", { ascending: false });

        if (!rows) return;

        const formateados: Presupuesto[] = rows.map((p: any) => ({
          id: p.id,
          fecha: p.fecha,
          estado: p.estado || "pendiente",
          data: {
            cliente: {
              nombre: p.cliente_nombre,
              telefono: p.cliente_telefono
            },
            activo: {
              tipo: p.equipo_tipo
            },
            problemas: p.problemas || [],
            tareas: p.tareas || [],
            config: {
              empresa: data.config.empresa,
              mostrarFechaHora: data.config.mostrarFechaHora,
              validezDias: data.config.validezDias
            }
          }
        }));

        setPresupuestos(formateados);

      } catch (err) {

        console.error("Error refrescando presupuestos", err);

      }

    };

    window.addEventListener("cotix-refresh", handler);

    return () => {
      window.removeEventListener("cotix-refresh", handler);
    };

  }, [data.config]);

  // ---------- TRIAL ----------
  const inicio = new Date(trialInicio).getTime();
  const ahora = new Date().getTime();

  const diasPasados = Math.floor(
    (ahora - inicio) / (1000 * 60 * 60 * 24)
  );

  const diasRestantes = Math.max(15 - diasPasados, 0);

  const trialActivo =
    plan === "free" && diasRestantes > 0;

  // ---------- REGISTRO DIARIO ----------
  const hoy = new Date().toISOString().split("T")[0];

  const registro = JSON.parse(
    localStorage.getItem("cotixRegistroDiario") || "{}"
  );

  const presupuestosHoy: number = registro[hoy] || 0;

  const limiteDiario: number =
    plan === "pro" ? Infinity : 2;

  const puedeCrearHoy: boolean =
    plan === "pro"
      ? true
      : trialActivo && presupuestosHoy < limiteDiario;

  const registrarCreacionHoy = () => {

    if (plan === "pro") return;

    const registroActual = JSON.parse(
      localStorage.getItem("cotixRegistroDiario") || "{}"
    );

    registroActual[hoy] =
      (registroActual[hoy] || 0) + 1;

    localStorage.setItem(
      "cotixRegistroDiario",
      JSON.stringify(registroActual)
    );

  };

  const activarPro = () => {
    setPlan("pro");
  };

  return (
    <CotixContext.Provider
      value={{
        data,
        setData,
        presupuestos,
        setPresupuestos,
        trialInicio,
        trialActivo,
        diasRestantes,
        presupuestosHoy,
        limiteDiario,
        plan,
        puedeCrearHoy,
        registrarCreacionHoy,
        activarPro,
        editingId,
        setEditingId
      }}
    >
      {children}
    </CotixContext.Provider>
  );
}

export function useCotix() {

  const context = useContext(CotixContext);

  if (!context) {
    throw new Error("useCotix debe usarse dentro de CotixProvider");
  }

  return context;

}