import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState<any>({});
  const [chart, setChart] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    cargar();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const cargar = async () => {

    const { data } = await supabase
      .from("presupuestos")
      .select("*")
      .order("fecha", { ascending: false });

    if (!data) return;

    const hoy = new Date();
    const hoyStr = hoy.toISOString().split("T")[0];
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    const total = data.length;

    const hoyCount = data.filter((p:any)=>
      p.fecha?.startsWith(hoyStr)
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

    const esteMes = data.filter((p:any)=>{
      const f = new Date(p.fecha);
      return (
        f.getMonth() === mesActual &&
        f.getFullYear() === anioActual
      );
    }).length;

    setStats({
      total,
      hoy:hoyCount,
      aprobados:aprobados.length,
      rechazados:rechazados.length,
      ingresos,
      ticketPromedio,
      esteMes
    });

    const dias:any = {};

    data.forEach((p:any)=>{

      const key = new Date(p.fecha)
        .toISOString()
        .split("T")[0];

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

        tech[mail]={
          total:0,
          ingresos:0
        };

      }

      tech[mail].total++;

      if(p.estado==="aprobado"){

        tech[mail].ingresos+=Number(p.total || 0);

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

  return (

    <div className="flex min-h-screen bg-[#0f172a] text-white">

      <div className="flex-1 p-8">

        <div className="flex justify-between items-center mb-8">

          <h1 className="text-2xl font-bold">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Cerrar sesión
          </button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-10">

          <KPI title="Total" value={stats.total}/>
          <KPI title="Hoy" value={stats.hoy}/>
          <KPI title="Este mes" value={stats.esteMes}/>
          <KPI title="Aprobados" value={stats.aprobados}/>
          <KPI title="Ingresos" value={`$${stats.ingresos?.toLocaleString()}`}/>
          <KPI title="Ticket prom." value={`$${stats.ticketPromedio?.toLocaleString()}`}/>

        </div>

        <div className="bg-black rounded-xl p-6 mb-10">

          <h2 className="mb-4 font-semibold">
            Actividad últimos 30 días
          </h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={chart}>

              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>

              <Line
                type="monotone"
                dataKey="total"
                stroke="#f97316"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <Card title="Top Técnicos">

            {ranking.map((t:any)=>(
              <div
                key={t.mail}
                className="flex justify-between py-2 border-b border-slate-800 text-sm"
              >
                <span>{t.mail}</span>
                <span>{t.total}</span>
              </div>
            ))}

          </Card>

          <Card title="Top Clientes">

            {clientes.map((c:any)=>(
              <div
                key={c.cliente}
                className="flex justify-between py-2 border-b border-slate-800 text-sm"
              >
                <span>{c.cliente}</span>
                <span>${c.total.toLocaleString()}</span>
              </div>
            ))}

          </Card>

          <Card title="Actividad reciente">

            {recent.map((p:any)=>(
              <div
                key={p.id}
                className="flex justify-between py-2 border-b border-slate-800 text-sm"
              >
                <span>{p.cliente_nombre}</span>
                <span>${p.total}</span>
              </div>
            ))}

          </Card>

        </div>

      </div>

    </div>

  );

}

function KPI({title,value}:{title:string,value:any}){

  return(

    <div className="bg-black rounded-xl p-5">

      <p className="text-sm text-gray-400">
        {title}
      </p>

      <p className="text-2xl font-bold">
        {value}
      </p>

    </div>

  );

}

function Card({title,children}:{title:string,children:any}){

  return(

    <div className="bg-black rounded-xl p-6">

      <h2 className="mb-4 font-semibold">
        {title}
      </h2>

      {children}

    </div>

  );

}