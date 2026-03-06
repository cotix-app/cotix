import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";
import { useState } from "react";

export default function Problema() {
  const navigate = useNavigate();
  const { data, setData } = useCotix();

  const seleccionados = data.problemas;
  const [otroProblema, setOtroProblema] = useState("");
  const problemas = ["NO ENFRÍA", "PIERDE GAS", "RUIDO EXCESIVO", "NO ENCIENDE", "MANTENIMIENTO PREVENTIVO", "OTRO",];
  const toggleProblema = (problema: string) => {
    let nuevosProblemas: string[];
    if (seleccionados.includes(problema)) {
      nuevosProblemas = seleccionados.filter((p) => p !== problema);
    } else {
      nuevosProblemas = [...seleccionados, problema];
    }
    setData({
      ...data,
      problemas: nuevosProblemas,
    });
  };
  const continuarHabilitado = seleccionados.length > 0 && (!seleccionados.includes("OTRO") || otroProblema.trim() !== "");
  return (<div className="min-h-screen bg-gray-100 flex flex-col p-6">
    <button onClick={() => navigate(-1)} className="mb-4 text-blue-900"> ← Volver </button>
    <h2 className="text-2xl font-bold mb-6 text-blue-900">
      Paso 3: Problema
    </h2>
    <div className="space-y-3 mb-6">
      {problemas.map((problema) => (<label key={problema} className="flex items-center space-x-3">
        <input type="checkbox"
          checked={seleccionados.includes(problema)}
          onChange={() => toggleProblema(problema)} />
        <span>{problema}</span> </label>))}
    </div> {seleccionados.includes("OTRO") && (<input type="text" placeholder="DESCRIBIR PROBLEMA" value={otroProblema}
      onChange={(e) => setOtroProblema(e.target.value.toUpperCase())} className="mb-6 p-3 border rounded-lg uppercase" />)}
    <button
      disabled={!continuarHabilitado}
      onClick={() => navigate("/tareas")}
      className="bg-[#FF7A00] text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-800 transition"
    >
      Continuar
    </button>
  </div>
  );
}