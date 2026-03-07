import { Link, Outlet, useNavigate } from "react-router-dom"
import { supabase } from "../../lib/supabase"

export default function AdminLayout(){

const navigate = useNavigate()

const logout = async()=>{

await supabase.auth.signOut()

navigate("/login")

}

return(

<div className="flex h-screen bg-[#0f172a] text-gray-200">

{/* SIDEBAR */}

<div className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col">

<div className="p-6 border-b border-slate-800">

<h1 className="text-xl font-bold text-white">
Cotix Admin
</h1>

<p className="text-xs text-gray-400">
Control Center
</p>

</div>

<nav className="flex-1 p-4 space-y-2 text-sm">

<MenuItem to="/admin">Dashboard</MenuItem>

<MenuItem to="/admin/empresas">Empresas</MenuItem>

<MenuItem to="/admin/tecnicos">Técnicos</MenuItem>

<MenuItem to="/admin/clientes">Clientes</MenuItem>

<MenuItem to="/admin/presupuestos">Presupuestos</MenuItem>

<MenuItem to="/admin/metricas">Métricas</MenuItem>

<MenuItem to="/admin/sistema">Sistema</MenuItem>

</nav>

<div className="p-4 border-t border-slate-800">

<button
onClick={logout}
className="w-full bg-red-600 hover:bg-red-700 rounded p-2 text-sm"
>
Cerrar sesión
</button>

</div>

</div>

{/* CONTENIDO */}

<div className="flex-1 flex flex-col">

{/* TOPBAR */}

<div className="h-16 border-b border-slate-800 flex items-center px-6 bg-[#020617]">

<input
placeholder="Buscar..."
className="bg-slate-800 px-4 py-2 rounded text-sm w-72"
/>

<div className="ml-auto text-sm text-gray-400">

Admin

</div>

</div>

{/* PAGE */}

<div className="flex-1 overflow-auto p-8">

<Outlet/>

</div>

</div>

</div>

)

}

function MenuItem({to,children}:{to:string,children:any}){

return(

<Link
to={to}
className="block px-3 py-2 rounded hover:bg-slate-800"
>
{children}
</Link>

)

}