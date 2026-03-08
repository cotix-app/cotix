import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import AdminTable from "../components/admin/AdminTable"

export default function AdminPresupuestos(){

const [presupuestos,setPresupuestos] = useState<any[]>([])

const columns = [
{ key: "cliente_nombre", label: "Cliente" },
{ key: "tecnico_mail", label: "Técnico" },
{ key: "total", label: "Total", align: "right" as const },
{ key: "estado", label: "Estado", align: "center" as const },
{ key: "fecha", label: "Fecha", align: "center" as const }
]

useEffect(()=>{
cargar()
},[])

const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("*")
.order("fecha",{ascending:false})

if(!data) return

const lista = data.map((p:any)=>({

...p,

fecha: p.fecha
? new Date(p.fecha).toLocaleDateString()
: "-",

total: Number(p.total || 0)

}))

setPresupuestos(lista)

}

return(

<div className="space-y-6">

<h1 className="text-xl md:text-2xl font-bold">
Todos los Presupuestos
</h1>

<AdminTable
columns={columns}
data={presupuestos}
/>


</div>

)

}