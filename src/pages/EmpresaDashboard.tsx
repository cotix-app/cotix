import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUser, getEmpresa } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function EmpresaDashboard() {

  const navigate = useNavigate();

  const [tecnicos,setTecnicos] = useState<any[]>([]);
  const [tecnicoAsignado,setTecnicoAsignado] = useState("");

  useEffect(()=>{
    cargar();
  },[]);

  const cargar = async()=>{

    const user = await getUser();
    if(!user) return;

    const empresaLocal = await getEmpresa();
    let empresaId = empresaLocal?.empresa_id;

    if(!empresaId){

      const { data:empresaLink } = await supabase
        .from("tecnicos_empresa")
        .select("empresa_id")
        .limit(1);

      if(!empresaLink || empresaLink.length === 0){
        console.log("empresa no encontrada");
        return;
      }

      empresaId = empresaLink[0].empresa_id;

    }

    const { data:relaciones } = await supabase
      .from("tecnicos_empresa")
      .select("user_id")
      .eq("empresa_id",empresaId);

    if(!relaciones) return;

    const ids = relaciones.map((r:any)=>r.user_id);

    const { data:profiles } = await supabase
      .from("profiles")
      .select("id,email")
      .in("id",ids);

    if(profiles){
      setTecnicos(profiles);
    }

  };

  const crearPresupuesto = ()=>{

    if(!tecnicoAsignado){
      alert("Seleccioná un técnico");
      return;
    }

    localStorage.setItem("cotix_tecnico_asignado",tecnicoAsignado);

    navigate("/cliente");

  };

  return(

  <div className="space-y-6">

    <h1 className="text-xl md:text-2xl font-bold">
      Panel Empresa
    </h1>

    <div className="bg-black rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 md:items-center">

      <select
        value={tecnicoAsignado}
        onChange={(e)=>setTecnicoAsignado(e.target.value)}
        className="bg-slate-800 px-3 py-2 rounded text-sm"
      >

        <option value="">
          Seleccionar técnico
        </option>

        {tecnicos.map((t:any)=>(
          <option key={t.id} value={t.email}>
            {t.email}
          </option>
        ))}

      </select>

      <button
        onClick={crearPresupuesto}
        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded text-sm"
      >

        Crear presupuesto

      </button>

    </div>

  </div>

  );

}