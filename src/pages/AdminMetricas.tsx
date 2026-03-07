import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AdminMetricas(){

const [stats,setStats] = useState({
  total:0,
  aprobados:0,
  ingresos:0,
  ticket:0
})

useEffect(()=>{
cargar()
},[])

const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("*")

if(!data) return

const total = data.length

const aprobados = data.filter((p:any)=>p.estado==="aprobado")

const ingresos = aprobados.reduce(
(sum:number,p:any)=>sum + Number(p.total || 0),
0
)

const ticket = aprobados.length
? Math.round(ingresos / aprobados.length)
:0

setStats({
total,
aprobados:aprobados.length,
ingresos,
ticket
})

}

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-8">
Métricas SaaS
</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

<Card title="Presupuestos" value={stats.total}/>
<Card title="Aprobados" value={stats.aprobados}/>
<Card title="Ingresos" value={`$${stats.ingresos.toLocaleString()}`}/>
<Card title="Ticket promedio" value={`$${stats.ticket.toLocaleString()}`}/>

</div>

</div>

)

}

function Card({title,value}:{title:string,value:any}){

return(

<div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

<p className="text-gray-400 text-sm mb-2">
{title}
</p>

<p className="text-2xl font-bold text-white">
{value}
</p>

</div>

)

}