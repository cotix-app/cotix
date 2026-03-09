import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUser } from "../lib/auth";
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

    const { data:link } = await supabase
      .from("tecnicos_empresa")
      .select("empresa_id")
      .eq("user_id",user.id)
      .maybeSingle();

    if(!link?.empresa_id) return;

    const empresaId = link.empresa_id;

    const { data:techs } = await supabase
      .from("tecnicos_empresa")
      .select("user_id, profiles(email)")
      .eq("empresa_id",empresaId);

    if(techs){

      const lista = techs.map((t:any)=>({
        id:t.user_id,
        email:t.profiles?.email || "sin email"
      }));

      setTecnicos(lista);

    }

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

    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

      <KPI title="Total" value={stats.total} />
      <KPI title="Hoy" value={stats.hoy} />
      <KPI title="Aprobados" value={stats.aprobados} />
      <KPI title="Rechazados" value={stats.rechazados} />
      <KPI title="Ingresos" value={`$${stats.ingresos?.toLocaleString()}`} />
      <KPI title="Ticket" value={`$${stats.ticketPromedio?.toLocaleString()}`} />

    </div>

    <div className="bg-black rounded-xl p-4 md:p-6">

      <h2 className="mb-4 font-semibold">
        Actividad últimos 30 días
      </h2>

      <div className="w-full h-[220px] md:h-[300px]">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={chart}>

            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />

            <Line
              type="monotone"
              dataKey="total"
              stroke="#f97316"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Card title="Top Técnicos">

        {ranking.map((t:any)=>(

          <div
            key={t.mail}
            className="flex justify-between py-2 border-b border-slate-800 text-sm"
          >
            <span className="truncate">
              {t.mail}
            </span>

            <span>
              {t.total}
            </span>

          </div>

        ))}

      </Card>

      <Card title="Top Clientes">

        {clientes.map((c:any)=>(

          <div
            key={c.cliente}
            className="flex justify-between py-2 border-b border-slate-800 text-sm"
          >

            <span className="truncate">
              {c.cliente}
            </span>

            <span>
              ${c.total.toLocaleString()}
            </span>

          </div>

        ))}

      </Card>

      <Card title="Actividad reciente">

        {recent.map((p:any)=>(

          <div
            key={p.id}
            className="flex justify-between py-2 border-b border-slate-800 text-sm"
          >

            <span className="truncate">
              {p.cliente_nombre}
            </span>

            <span>
              ${p.total}
            </span>

          </div>

        ))}

      </Card>

    </div>

  </div>

  );

}

function KPI({title,value}:{title:string,value:any}){

  return(

  <div className="bg-black rounded-xl p-4 md:p-5">

    <p className="text-xs md:text-sm text-gray-400">
      {title}
    </p>

    <p className="text-lg md:text-2xl font-bold">
      {value ?? 0}
    </p>

  </div>

  );

}

function Card({title,children}:{title:string,children:any}){

  return(

  <div className="bg-black rounded-xl p-4 md:p-6">

    <h2 className="mb-4 font-semibold text-sm md:text-base">
      {title}
    </h2>

    {children}

  </div>

  );

}