import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import AdminTable from "../components/admin/AdminTable"

export default function AdminClientes(){

const [clientes,setClientes] = useState<any[]>([])

const columns = [
  { key: "cliente", label: "Cliente" },
  { key: "operaciones", label: "Operaciones", align: "center" as const },
  { key: "total", label: "Total generado", align: "right" as const }
]

useEffect(()=>{
cargar()
},[])

const cargar = async()=>{

const { data } = await supabase
.from("presupuestos")
.select("cliente_nombre,total")

if(!data) return

const map:any = {}

data.forEach((p:any)=>{

const cliente = p.cliente_nombre || "sin nombre"

if(!map[cliente]){

map[cliente] = {
cliente: cliente,
total: 0,
operaciones: 0
}

}

map[cliente].operaciones++
map[cliente].total += Number(p.total || 0)

})

const lista = Object.values(map)

setClientes(lista)

}

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-6">
Clientes
</h1>

<AdminTable
columns={columns}
data={clientes}
/>

</div>

)

}