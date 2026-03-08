import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import AdminTable from "../components/admin/AdminTable";

export default function AdminDatos() {

  const [data,setData] = useState<any[]>([])

  const [busqueda,setBusqueda] = useState("")
  const [estado,setEstado] = useState("")
  const [tecnico,setTecnico] = useState("")
  const [empresa,setEmpresa] = useState("")

  const [pais,setPais] = useState("")
  const [provincia,setProvincia] = useState("")
  const [localidad,setLocalidad] = useState("")

  const [desde,setDesde] = useState("")
  const [hasta,setHasta] = useState("")

  const [stats,setStats] = useState<any>({})

  const columns = [
    { key:"cliente_nombre",label:"Cliente" },
    { key:"cliente_localidad",label:"Localidad" },
    { key:"cliente_provincia",label:"Provincia" },
    { key:"cliente_pais",label:"País" },
    { key:"tecnico_mail",label:"Técnico" },
    { key:"empresa",label:"Empresa" },
    { key:"equipo_tipo",label:"Equipo" },
    { key:"problemas_txt",label:"Problemas" },
    { key:"tareas_txt",label:"Tareas" },
    { key:"total",label:"Total",align:"right" as const },
    { key:"estado",label:"Estado",align:"center" as const },
    { key:"fecha",label:"Fecha",align:"center" as const }
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

      empresa:p.tecnico_mail?.split("@")[1] || "independiente",

      problemas_txt:(p.problemas || []).join(", "),

      tareas_txt:(p.tareas || [])
      .map((t:any)=>`${t.descripcion} ($${t.precio})`)
      .join(" | "),

      fecha:p.fecha
      ? new Date(p.fecha).toLocaleString()
      : "-"

    }))

    setData(lista)
    calcularStats(lista)

  }

  const calcularStats = (lista:any[])=>{

    const total = lista.length

    const ingresos = lista
      .filter(p=>p.estado==="aprobado")
      .reduce((sum,p)=>sum + Number(p.total || 0),0)

    const ticket = total ? Math.round(ingresos / total) : 0

    const clientesUnicos = new Set(lista.map(p=>p.cliente_nombre)).size

    const tecnicos = new Set(lista.map(p=>p.tecnico_mail)).size

    setStats({
      total,
      ingresos,
      ticket,
      clientes:clientesUnicos,
      tecnicos
    })

  }

  const filtrados = data.filter((row:any)=>{

    const texto = Object.values(row).join(" ").toLowerCase()

    const coincideBusqueda =
      texto.includes(busqueda.toLowerCase())

    const coincideEstado =
      estado ? row.estado === estado : true

    const coincideTecnico =
      tecnico ? row.tecnico_mail === tecnico : true

    const coincideEmpresa =
      empresa ? row.empresa === empresa : true

    const coincidePais =
      pais ? row.cliente_pais === pais : true

    const coincideProvincia =
      provincia ? row.cliente_provincia === provincia : true

    const coincideLocalidad =
      localidad ? row.cliente_localidad === localidad : true

    const fecha = new Date(row.fecha)

    const coincideDesde =
      desde ? fecha >= new Date(desde) : true

    const coincideHasta =
      hasta ? fecha <= new Date(hasta) : true

    return(

      coincideBusqueda &&
      coincideEstado &&
      coincideTecnico &&
      coincideEmpresa &&
      coincidePais &&
      coincideProvincia &&
      coincideLocalidad &&
      coincideDesde &&
      coincideHasta

    )

  })

  const exportCSV = ()=>{

    const headers = Object.keys(filtrados[0] || {})

    const rows = filtrados.map(r =>
      headers.map(h=>`"${r[h]}"`).join(",")
    )

    const csv =
      headers.join(",") + "\n" +
      rows.join("\n")

    const blob = new Blob([csv],{type:"text/csv"})

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")

    a.href = url
    a.download = "cotix_datos.csv"

    a.click()

  }

  const tecnicos = [...new Set(data.map(d=>d.tecnico_mail))]
  const empresas = [...new Set(data.map(d=>d.empresa))]
  const paises = [...new Set(data.map(d=>d.cliente_pais))]
  const provincias = [...new Set(data.map(d=>d.cliente_provincia))]
  const localidades = [...new Set(data.map(d=>d.cliente_localidad))]

  return(

  <div className="space-y-6">

  <h1 className="text-xl md:text-2xl font-bold">
  Centro de Datos Cotix
  </h1>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

  <KPI title="Presupuestos" value={stats.total}/>
  <KPI title="Ingresos" value={`$${stats.ingresos?.toLocaleString()}`}/>
  <KPI title="Ticket Prom." value={`$${stats.ticket}`}/>
  <KPI title="Clientes" value={stats.clientes}/>
  <KPI title="Técnicos activos" value={stats.tecnicos}/>

  </div>

  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid md:grid-cols-9 gap-4">

  <input
  placeholder="Buscar..."
  value={busqueda}
  onChange={(e)=>setBusqueda(e.target.value)}
  className="bg-slate-800 px-3 py-2 rounded text-sm"
  />

  <select value={estado} onChange={(e)=>setEstado(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">Estado</option>
  <option value="aprobado">Aprobado</option>
  <option value="rechazado">Rechazado</option>
  </select>

  <select value={tecnico} onChange={(e)=>setTecnico(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">Técnico</option>
  {tecnicos.map((t:any)=>(<option key={t}>{t}</option>))}
  </select>

  <select value={empresa} onChange={(e)=>setEmpresa(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">Empresa</option>
  {empresas.map((e:any)=>(<option key={e}>{e}</option>))}
  </select>

  <select value={pais} onChange={(e)=>setPais(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">País</option>
  {paises.map((p:any)=>(<option key={p}>{p}</option>))}
  </select>

  <select value={provincia} onChange={(e)=>setProvincia(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">Provincia</option>
  {provincias.map((p:any)=>(<option key={p}>{p}</option>))}
  </select>

  <select value={localidad} onChange={(e)=>setLocalidad(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm">
  <option value="">Localidad</option>
  {localidades.map((l:any)=>(<option key={l}>{l}</option>))}
  </select>

  <input type="date" value={desde} onChange={(e)=>setDesde(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm"/>

  <input type="date" value={hasta} onChange={(e)=>setHasta(e.target.value)} className="bg-slate-800 px-3 py-2 rounded text-sm"/>

  </div>

  <div className="flex justify-between items-center">

  <span className="text-sm text-gray-400">
  {filtrados.length} resultados
  </span>

  <button onClick={exportCSV} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm">
  Exportar CSV
  </button>

  </div>

  <AdminTable columns={columns} data={filtrados}/>

  </div>

  )

}

function KPI({title,value}:{title:string,value:any}){

return(

<div className="bg-slate-900 border border-slate-800 rounded-xl p-4">

<p className="text-xs text-gray-400">
{title}
</p>

<p className="text-xl font-bold">
{value ?? 0}
</p>

</div>

)

}