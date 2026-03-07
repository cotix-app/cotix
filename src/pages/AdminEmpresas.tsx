import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import AdminTable from "../components/admin/AdminTable"

const columns = [
  { key: "empresa", label: "Empresa" },
  { key: "tecnicos", label: "Técnicos", align: "center" as const },
  { key: "presupuestos", label: "Presupuestos", align: "center" as const },
  { key: "ingresos", label: "Ingresos", align: "right" as const }
]

export default function AdminEmpresas(){

const [empresas,setEmpresas] = useState<any[]>([])

useEffect(()=>{
cargar()
},[])

const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("tecnico_mail,total")

if(!data) return

const map:any = {}

data.forEach((p:any)=>{

const dominio =
p.tecnico_mail?.split("@")[1] || "independiente"

if(!map[dominio]){

map[dominio] = {
empresa:dominio,
tecnicos:new Set<string>(),
presupuestos:0,
ingresos:0
}

}

if(p.tecnico_mail){
map[dominio].tecnicos.add(p.tecnico_mail)
}

map[dominio].presupuestos++

map[dominio].ingresos += Number(p.total || 0)

})

const lista = Object.values(map).map((e:any)=>({

empresa:e.empresa,
tecnicos:e.tecnicos.size,
presupuestos:e.presupuestos,
ingresos:e.ingresos

}))

setEmpresas(lista)

}

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-6">
Empresas
</h1>

<AdminTable
columns={columns}
data={empresas}
/>

</div>

)

}