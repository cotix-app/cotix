import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { logout } from "../../lib/auth"

export default function AdminLayout(){

const navigate = useNavigate()

const [collapsed,setCollapsed] = useState(false)
const [mobileOpen,setMobileOpen] = useState(false)

const handleLogout = async()=>{
await logout()
navigate("/login")
}

const closeMenu = ()=>{
setMobileOpen(false)
setCollapsed(true)
}

return(

<div className="flex min-h-screen w-full bg-[#0f172a] text-white">

{mobileOpen && (
<div
className="fixed inset-0 bg-black/60 z-40 lg:hidden"
onClick={()=>setMobileOpen(false)}
/>
)}

<div
className={`
fixed lg:static z-50 top-0 left-0 h-full
bg-[#020617]
border-r border-slate-800
transition-all duration-300 flex flex-col
${collapsed ? "w-[70px]" : "w-[240px]"}
${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
`}
>

<div className="p-4 border-b border-slate-800 flex items-center justify-between">

<span className="font-bold text-orange-500">
{collapsed ? "C" : "Cotix Admin"}
</span>

<button
className="hidden lg:block text-gray-400"
onClick={()=>setCollapsed(!collapsed)}
>
{collapsed ? "›" : "‹"}
</button>

</div>

<nav className="flex flex-col p-2 gap-1">

<MenuItem to="/admin" label="Dashboard" icon="📊" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/empresas" label="Empresas" icon="🏢" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/tecnicos" label="Técnicos" icon="👨‍🔧" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/clientes" label="Clientes" icon="👥" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/presupuestos" label="Presupuestos" icon="📄" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/metricas" label="Métricas" icon="📈" collapsed={collapsed} onClick={closeMenu}/>
<MenuItem to="/admin/sistema" label="Sistema" icon="⚙️" collapsed={collapsed} onClick={closeMenu}/>

</nav>

<div className="mt-auto p-4">

<button
onClick={handleLogout}
className="bg-red-600 hover:bg-red-700 w-full py-2 rounded text-sm"
>
{collapsed ? "⎋" : "Cerrar sesión"}
</button>

</div>

</div>

{/* CONTENIDO */}

<div className="flex-1 flex flex-col min-w-0">

<header className="h-[60px] border-b border-slate-800 flex items-center px-4 md:px-6 bg-[#020617]">

<button
className="lg:hidden mr-3 text-xl"
onClick={()=>setMobileOpen(true)}
>
☰
</button>

<div className="text-sm font-semibold">
Panel de administración
</div>

<div className="ml-6 hidden md:block">

<input
placeholder="Buscar..."
className="bg-slate-800 text-sm px-3 py-1 rounded outline-none"
/>

</div>

<div className="ml-auto flex items-center gap-4">

<div className="text-xs text-gray-400">
Cotix SaaS
</div>

<div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
C
</div>

</div>

</header>

{/* CONTENIDO SCROLLABLE */}

<main className="flex-1 min-w-0 p-4 md:p-6">

<Outlet/>

</main>

</div>

</div>

)

}

function MenuItem({
to,
label,
icon,
collapsed,
onClick
}:{
to:string
label:string
icon:string
collapsed:boolean
onClick?:()=>void
}){

return(

<NavLink
to={to}
onClick={onClick}
className={({isActive})=>
`
px-3 py-2 rounded text-sm
flex items-center gap-3
transition
${isActive
? "bg-orange-600 text-white"
: "text-gray-400 hover:bg-slate-800 hover:text-white"
}
`
}
>

<span className="text-base">
{icon}
</span>

{!collapsed && label}

</NavLink>

)

}