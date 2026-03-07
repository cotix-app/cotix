export default function AdminSistema(){

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-8">
Estado del sistema
</h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<Status label="Base de datos" status="online"/>
<Status label="API Supabase" status="activo"/>
<Status label="Servidor" status="ok"/>

</div>

</div>

)

}

function Status({label,status}:{label:string,status:string}){

const getColor = () => {

if(status === "online" || status === "activo" || status === "ok"){
return "text-green-400 bg-green-500/10 border-green-500/20"
}

if(status === "warning"){
return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
}

return "text-red-400 bg-red-500/10 border-red-500/20"

}

return(

<div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between">

<span className="text-gray-300">
{label}
</span>

<span className={`px-3 py-1 rounded text-sm font-semibold border ${getColor()}`}>
{status}
</span>

</div>

)

}