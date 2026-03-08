import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";
import { useState } from "react";

export default function Activo() {
  const navigate = useNavigate();
  const { data, setData } = useCotix();

  const [tipoSeleccionado, setTipoSeleccionado] = useState(
    data.activo?.tipo || "",
  );

  const [otroActivo, setOtroActivo] = useState("");

  const handleContinuar = () => {
    let tipoFinal = tipoSeleccionado;

    if (tipoSeleccionado === "OTRO") {
      if (!otroActivo.trim()) return;

      tipoFinal = otroActivo.toUpperCase();
    }

    setData((prev) => ({
      ...prev,
      activo: {
        ...prev.activo,
        tipo: tipoFinal,
      },
    }));

    navigate("/problemas");
  };

  const tipos = ["SPLIT", "CENTRAL", "CÁMARA", "REFRIGERADOR", "OTRO"];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Volver
      </button>

      <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-6 text-blue-900">Tipo de Equipo</h2>

        <div className="space-y-3">
          {tipos.map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoSeleccionado(tipo)}
              className={`w-full py-2 rounded-lg border transition
              ${
                tipoSeleccionado === tipo
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>

        {tipoSeleccionado === "OTRO" && (
          <input
            type="text"
            placeholder="Especificar equipo"
            value={otroActivo}
            onChange={(e) => setOtroActivo(e.target.value.toUpperCase())}
            className="mt-4 w-full border p-2 rounded-lg uppercase"
          />
        )}

        <button
          onClick={handleContinuar}
          className="mt-6 bg-[#FF7A00] text-white py-2 px-4 rounded-xl w-full hover:bg-blue-800 transition"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
