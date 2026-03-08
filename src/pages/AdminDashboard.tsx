import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {



const [stats,setStats] = useState<any>({})
const [chart,setChart] = useState<any[]>([])
const [ranking,setRanking] = useState<any[]>([])
const [clientes,setClientes] = useState<any[]>([])
const [recent,setRecent] = useState<any[]>([])

useEffect(()=>{
cargar()
},[])


const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("*")
.order("fecha",{ascending:false})

if(!data) return

const hoy = new Date()
const hoyStr = hoy.toISOString().split("T")[0]
const mesActual = hoy.getMonth()
const anioActual = hoy.getFullYear()

const total = data.length

const hoyCount = data.filter((p:any)=>
p.fecha?.startsWith(hoyStr)
).length

const aprobados = data.filter((p:any)=>p.estado==="aprobado")
const rechazados = data.filter((p:any)=>p.estado==="rechazado")

const ingresos = aprobados.reduce(
(sum:number,p:any)=>sum + Number(p.total || 0),0
)

const ticketPromedio = aprobados.length
? Math.round(ingresos / aprobados.length)
:0

const esteMes = data.filter((p:any)=>{
const f = new Date(p.fecha)
return f.getMonth() === mesActual && f.getFullYear() === anioActual
}).length

setStats({
total,
hoy:hoyCount,
aprobados:aprobados.length,
rechazados:rechazados.length,
ingresos,
ticketPromedio,
esteMes
})

/* chart */

const dias:any = {}

data.forEach((p:any)=>{

const key = new Date(p.fecha).toISOString().split("T")[0]

if(!dias[key]) dias[key]=0

dias[key]++

})

const chartData = Object.entries(dias)
.map(([date,total])=>({date,total}))
.slice(-30)

setChart(chartData)

/* ranking tecnicos */

const tech:any={}

data.forEach((p:any)=>{

const mail = p.tecnico_mail || "desconocido"

if(!tech[mail]){
tech[mail]={total:0,ingresos:0}
}

tech[mail].total++

if(p.estado==="aprobado"){
tech[mail].ingresos+=Number(p.total || 0)
}

})

const rankingTech = Object.entries(tech)
.map(([mail,val]:any)=>({
mail,
total:val.total,
ingresos:val.ingresos
}))
.sort((a:any,b:any)=>b.total-a.total)

setRanking(rankingTech.slice(0,5))

/* clientes */

const clientesMap:any={}

data.forEach((p:any)=>{

const cliente = p.cliente_nombre || "desconocido"

if(!clientesMap[cliente]){
clientesMap[cliente]=0
}

clientesMap[cliente]+=Number(p.total || 0)

})

const topClientes = Object.entries(clientesMap)
.map(([cliente,total])=>({cliente,total}))
.sort((a:any,b:any)=>b.total-a.total)

setClientes(topClientes.slice(0,5))

setRecent(data.slice(0,8))

}

return(

<div className="min-h-screen bg-[#0f172a] text-white">

<div className="max-w-7xl mx-auto px-4 py-6">

{/* header */}

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

<h1 className="text-xl md:text-2xl font-bold">
Admin Dashboard
</h1>


</div>

{/* KPIs */}

<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">

<KPI title="Total" value={stats.total}/>
<KPI title="Hoy" value={stats.hoy}/>
<KPI title="Este mes" value={stats.esteMes}/>
<KPI title="Aprobados" value={stats.aprobados}/>
<KPI title="Ingresos" value={`$${stats.ingresos?.toLocaleString()}`}/>
<KPI title="Ticket" value={`$${stats.ticketPromedio?.toLocaleString()}`}/>

</div>

{/* chart */}

<div className="bg-black rounded-xl p-4 md:p-6 mb-8">

<h2 className="mb-4 font-semibold text-sm md:text-base">
Actividad últimos 30 días
</h2>

<div className="w-full h-[220px] md:h-[300px]">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={chart}>

<XAxis dataKey="date" hide/>
<YAxis hide/>

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

</div>

{/* lists */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<Card title="Top Técnicos">

{ranking.map((t:any)=>(
<div
key={t.mail}
className="flex justify-between py-2 border-b border-slate-800 text-sm"
>
<span className="truncate">{t.mail}</span>
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
<span className="truncate">{c.cliente}</span>
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
<span className="truncate">{p.cliente_nombre}</span>
<span>${p.total}</span>
</div>
))}

</Card>

</div>

</div>

</div>

)

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

)

}

function Card({title,children}:{title:string,children:any}){

return(

<div className="bg-black rounded-xl p-4 md:p-6">

<h2 className="mb-4 font-semibold text-sm md:text-base">
{title}
</h2>

{children}

</div>

)
}