import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import AdminTable from "../components/admin/AdminTable"

export default function AdminTecnicos(){

const [tecnicos,setTecnicos] = useState<any[]>([])

const columns = [
  { key: "mail", label: "Técnico" },
  { key: "presupuestos", label: "Presupuestos", align: "center" as const },
  { key: "aprobados", label: "Aprobados", align: "center" as const },
  { key: "ingresos", label: "Ingresos", align: "right" as const }
]

useEffect(()=>{
cargar()
},[])

const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("*")

if(!data) return

const map:any = {}

data.forEach((p:any)=>{

const tech = p.tecnico_mail || "desconocido"

if(!map[tech]){

map[tech] = {
mail: tech,
presupuestos: 0,
ingresos: 0,
aprobados: 0
}

}

map[tech].presupuestos++

if(p.estado === "aprobado"){

map[tech].aprobados++
map[tech].ingresos += Number(p.total || 0)

}

})

const lista = Object.values(map)

setTecnicos(lista)

}

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-6">
Técnicos
</h1>

<AdminTable
columns={columns}
data={tecnicos}
/>

</div>

)

}