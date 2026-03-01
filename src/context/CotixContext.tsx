import { createContext, useContext, useEffect, useState } from "react";

export type CotixData = {
  cliente: { nombre: string; telefono: string };
  activo: { tipo: string };
  problemas: string[];
  tareas: { descripcion: string; detalle?: string;  precio: number }[];
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
  plan: PlanType;
  puedeCrearHoy: () => boolean;
  registrarCreacionHoy: () => void;
  activarPro: () => void;
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

  useEffect(() => {
    localStorage.setItem("cotixData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem("cotixHistorial", JSON.stringify(presupuestos));
  }, [presupuestos]);

  useEffect(() => {
    localStorage.setItem("cotixPlan", plan);
  }, [plan]);

  // 🔥 Cálculo días restantes
  const inicio = new Date(trialInicio).getTime();
  const ahora = new Date().getTime();
  const diasPasados = Math.floor(
    (ahora - inicio) / (1000 * 60 * 60 * 24)
  );

  const diasRestantes = Math.max(15 - diasPasados, 0);

  const trialActivo = plan === "free" && diasRestantes > 0;

  // 🔥 Límite diario solo para FREE
  const puedeCrearHoy = () => {
    if (plan === "pro") return true;
    if (!trialActivo) return false;

    const hoy = new Date().toISOString().split("T")[0];
    const registro = JSON.parse(
      localStorage.getItem("cotixRegistroDiario") || "{}"
    );
    const usadosHoy = registro[hoy] || 0;

    return usadosHoy < 2;
  };

  const registrarCreacionHoy = () => {
    if (plan === "pro") return;

    const hoy = new Date().toISOString().split("T")[0];
    const registro = JSON.parse(
      localStorage.getItem("cotixRegistroDiario") || "{}"
    );

    registro[hoy] = (registro[hoy] || 0) + 1;

    localStorage.setItem("cotixRegistroDiario", JSON.stringify(registro));
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
        plan,
        puedeCrearHoy,
        registrarCreacionHoy,
        activarPro,
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