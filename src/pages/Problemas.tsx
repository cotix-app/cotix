import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";
import { useState } from "react";

export default function Problema() {
  const navigate = useNavigate();
  const { data, setData } = useCotix();

  const seleccionados = data.problemas || [];
  const [otroProblema, setOtroProblema] = useState("");

  const problemas = [
    "NO ENFRÍA",
    "PIERDE GAS",
    "RUIDO EXCESIVO",
    "NO ENCIENDE",
    "MANTENIMIENTO PREVENTIVO",
    "OTRO",
  ];

  const toggleProblema = (problema: string) => {
    let nuevos: string[];

    if (seleccionados.includes(problema)) {
      nuevos = seleccionados.filter((p) => p !== problema);
    } else {
      nuevos = [...seleccionados, problema];
    }

    setData((prev) => ({
      ...prev,
      problemas: nuevos,
    }));
  };

  const continuar = () => {
    let lista = [...seleccionados];

    if (seleccionados.includes("OTRO") && otroProblema.trim()) {
      lista = lista.filter((p) => p !== "OTRO");
      lista.push(otroProblema.toUpperCase());
    }

    setData((prev) => ({
      ...prev,
      problemas: lista,
    }));

    navigate("/tareas");
  };

  const continuarHabilitado =
    seleccionados.length > 0 &&
    (!seleccionados.includes("OTRO") || otroProblema.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-900">
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        Paso 3: Problema
      </h2>

      <div className="space-y-3 mb-6">
        {problemas.map((problema) => (
          <label key={problema} className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={seleccionados.includes(problema)}
              onChange={() => toggleProblema(problema)}
            />

            <span>{problema}</span>
          </label>
        ))}
      </div>

      {seleccionados.includes("OTRO") && (
        <input
          type="text"
          placeholder="DESCRIBIR PROBLEMA"
          value={otroProblema}
          onChange={(e) => setOtroProblema(e.target.value.toUpperCase())}
          className="mb-6 p-3 border rounded-lg uppercase"
        />
      )}

      <button
        disabled={!continuarHabilitado}
        onClick={continuar}
        className="bg-[#FF7A00] text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-800 transition"
      >
        Continuar
      </button>
    </div>
  );
}
