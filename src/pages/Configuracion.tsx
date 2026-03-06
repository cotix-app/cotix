import { useState } from "react";
import { useCotix } from "../context/CotixContext";
import { guardarConfig } from "../lib/configSync";

export default function Configuracion() {

  const { data, setData } = useCotix();

  const [configLocal, setConfigLocal] = useState(data.config);

  const handleChange = (campo: string, valor: any) => {
    setConfigLocal({
      ...configLocal,
      [campo]: valor
    });
  };

  const guardar = async () => {

    const nuevoData = {
      ...data,
      config: configLocal
    };

    setData(nuevoData);

    await guardarConfig(configLocal);

    alert("Configuración guardada");

  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-center">
          Configuración
        </h2>

        {/* Empresa */}
        <div>
          <label className="block text-sm font-medium">
            Nombre de empresa
          </label>

          <input
            type="text"
            value={configLocal.empresa}
            onChange={(e) =>
              handleChange("empresa", e.target.value.toUpperCase())
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Mostrar fecha */}
        <div className="flex items-center justify-between">

          <span>Mostrar fecha en PDF</span>

          <input
            type="checkbox"
            checked={configLocal.mostrarFechaHora}
            onChange={(e) =>
              handleChange("mostrarFechaHora", e.target.checked)
            }
          />

        </div>

        {/* Validez */}
        <div>
          <label className="block text-sm font-medium">
            Días de validez
          </label>

          <input
            type="number"
            min="0"
            value={configLocal.validezDias}
            onChange={(e) =>
              handleChange(
                "validezDias",
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>


        {/* BOTÓN GUARDAR */}

        <button
          onClick={guardar}
          className="w-full bg-[#FF7A00] text-white py-2 rounded-lg mt-4"
        >
          Guardar configuración
        </button>

      </div>

    </div>
  );
}