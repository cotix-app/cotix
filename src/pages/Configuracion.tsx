import { useCotix } from "../context/CotixContext";


export default function Configuracion() {
  const { data, setData } = useCotix();
  

  const handleChange = (campo: string, valor: any) => {
    setData({
      ...data,
      config: {
        ...data.config,
        [campo]: valor,
      },
    });
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
            value={data.config.empresa}
            onChange={(e) =>
              handleChange("empresa", e.target.value.toUpperCase())
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Mostrar Fecha */}
        <div className="flex items-center justify-between">
          <span>Mostrar fecha en PDF</span>
          <input
            type="checkbox"
            checked={data.config.mostrarFechaHora}
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
            value={data.config.validezDias}
            onChange={(e) =>
              handleChange(
                "validezDias",
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>
      </div>
    </div>
  );
}