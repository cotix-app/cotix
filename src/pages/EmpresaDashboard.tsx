import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUser, getEmpresa } from "../lib/auth";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EmpresaDashboard() {

  const navigate = useNavigate();

  const [stats,setStats] = useState<any>({});
  const [chart,setChart] = useState<any[]>([]);
  const [ranking,setRanking] = useState<any[]>([]);
  const [clientes,setClientes] = useState<any[]>([]);
  const [recent,setRecent] = useState<any[]>([]);

  const [tecnicos,setTecnicos] = useState<any[]>([]);
  const [tecnicoAsignado,setTecnicoAsignado] = useState("");

  useEffect(()=>{
    cargar();
  },[]);

  const cargar = async()=>{

    const user = await getUser();
    if(!user) return;

    /* empresa */

    const empresaLocal = await getEmpresa();
    let empresaId = empresaLocal?.empresa_id;

    if(!empresaId){

      const { data } = await supabase
        .from("tecnicos_empresa")
        .select("empresa_id")
        .limit(1);

      if(!data || data.length === 0){
        console.log("empresa no encontrada");
        return;
      }

      empresaId = data[0].empresa_id;

    }

    /* tecnicos */

    const { data:relaciones } = await supabase
      .from("tecnicos_empresa")
      .select("user_id")
      .eq("empresa_id",empresaId);

    if(!relaciones) return;

    const ids = relaciones.map((r:any)=>r.user_id);

    const { data:profiles } = await supabase
      .from("profiles")
      .select("id,email")
      .in("id",ids);

    if(profiles){
      setTecnicos(profiles);
    }

    /* presupuestos */

    const { data } = await supabase
      .from("presupuestos")
      .select("*")
      .eq("empresa_id",empresaId)
      .order("fecha",{ascending:false});

    if(!data){
      setStats({});
      setChart([]);
      setRanking([]);
      setClientes([]);
      setRecent([]);
      return;
    }

    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];

    const total = data.length;

    const hoyCount = data.filter((p:any)=>
      p.fecha && p.fecha.startsWith(hoyStr)
    ).length;

    const aprobados = data.filter((p:any)=>p.estado==="aprobado");
    const rechazados = data.filter((p:any)=>p.estado==="rechazado");

    const ingresos = aprobados.reduce(
      (sum:number,p:any)=>sum + Number(p.total || 0),
      0
    );

    const ticketPromedio = aprobados.length
      ? Math.round(ingresos / aprobados.length)
      : 0;

    setStats({
      total,
      hoy:hoyCount,
      aprobados:aprobados.length,
      rechazados:rechazados.length,
      ingresos,
      ticketPromedio
    });

    /* chart */

    const dias:any = {};

    data.forEach((p:any)=>{

      if(!p.fecha) return;

      const key = new Date(p.fecha).toISOString().split("T")[0];

      if(!dias[key]) dias[key]=0;

      dias[key]++;

    });

    const chartData = Object.entries(dias)
      .map(([date,total])=>({date,total}))
      .slice(-30);

    setChart(chartData);

    /* ranking */

    const tech:any = {};

    data.forEach((p:any)=>{

      const mail = p.tecnico_mail || "desconocido";

      if(!tech[mail]){
        tech[mail]={total:0,ingresos:0};
      }

      tech[mail].total++;

      if(p.estado==="aprobado"){
        tech[mail].ingresos += Number(p.total || 0);
      }

    });

    const rankingTech = Object.entries(tech)
      .map(([mail,val]:any)=>({
        mail,
        total:val.total,
        ingresos:val.ingresos
      }))
      .sort((a:any,b:any)=>b.total-a.total);

    setRanking(rankingTech.slice(0,5));

    /* clientes */

    const clientesMap:any = {};

    data.forEach((p:any)=>{

      const cliente = p.cliente_nombre || "desconocido";

      if(!clientesMap[cliente]){
        clientesMap[cliente]=0;
      }

      clientesMap[cliente]+=Number(p.total || 0);

    });

    const topClientes = Object.entries(clientesMap)
      .map(([cliente,total])=>({cliente,total}))
      .sort((a:any,b:any)=>b.total-a.total);

    setClientes(topClientes.slice(0,5));

    setRecent(data.slice(0,8));

  };

  const crearPresupuesto = ()=>{

    if(!tecnicoAsignado){
      alert("Seleccioná un técnico");
      return;
    }

    localStorage.setItem("cotix_tecnico_asignado",tecnicoAsignado);

    navigate("/cliente");

  };

  return(

  <div className="space-y-6">

    <h1 className="text-xl md:text-2xl font-bold">
      Panel Empresa
    </h1>

    <div className="bg-black rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center">

      <select
        value={tecnicoAsignado}
        onChange={(e)=>setTecnicoAsignado(e.target.value)}
        className="bg-slate-800 px-3 py-2 rounded text-sm"
      >

        <option value="">
          Seleccionar técnico
        </option>

        {tecnicos.map((t:any)=>(
          <option key={t.id} value={t.email}>
            {t.email}
          </option>
        ))}

      </select>

      <button
        onClick={crearPresupuesto}
        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
      >

        Crear presupuesto

      </button>

    </div>

  </div>

  );

}