import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUser } from "../lib/auth";

export default function EmpresaTecnicos() {
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [empresaId, setEmpresaId] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const user = await getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("tecnicos_empresa")
      .select("empresa_id")
      .eq("user_id", user.id)
      .limit(1);

    if (error || !data || data.length === 0) {
      console.error(error);
      return;
    }

    const empresa = data[0].empresa_id;

    setEmpresaId(empresa);

    await cargarTecnicos(empresa);
  };

  /* cargar tecnicos */

  const cargarTecnicos = async (empresa: string) => {
    const { data, error } = await supabase
      .from("tecnicos_empresa")
      .select("user_id")
      .eq("empresa_id", empresa);

    if (error || !data) {
      console.error(error);
      return;
    }

    /* traer emails */

    const ids = data.map((t: any) => t.user_id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id,email")
      .in("id", ids);

    if (!profiles) return;

    setTecnicos(profiles);
  };

  /* crear tecnico */

  const crearTecnico = async () => {
    if (!email) {
      alert("Ingresá email");
      return;
    }

    if (!empresaId) {
      alert("Empresa no encontrada");
      return;
    }

    /* crear usuario */

    const { data, error } = await supabase.auth.signUp({
      email,
      password: "Temp1234!",
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userNuevo = data.user;

    if (!userNuevo) {
      alert("No se pudo crear usuario");
      return;
    }

    /* profile */

    await supabase.from("profiles").upsert({
      id: userNuevo.id,
      email,
      role: "tech",
    });

    /* link empresa */

    await supabase.from("tecnicos_empresa").insert({
      empresa_id: empresaId,
      user_id: userNuevo.id,
      rol: "tech",
    });

    setEmail("");

    await cargarTecnicos(empresaId);
  };

  /* UI */

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Técnicos de la empresa</h1>

      <div className="bg-black p-4 rounded-xl flex gap-2">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email tecnico"
          className="bg-slate-800 px-3 py-2 rounded text-sm flex-1"
        />

        <button
          onClick={crearTecnico}
          className="bg-orange-600 px-4 py-2 rounded"
        >
          Crear técnico
        </button>
      </div>

      <div className="bg-black p-4 rounded-xl space-y-2">
        {tecnicos.map((t: any) => (
          <div
            key={t.id}
            className="flex justify-between border-b border-slate-800 py-2"
          >
            <span>{t.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
