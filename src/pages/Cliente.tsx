import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";

export default function Cliente() {
  const navigate = useNavigate();
  const { data, setData } = useCotix();

  const { nombre, telefono, pais, provincia, localidad } = data.cliente;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-900">
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        Paso 1: Cliente
      </h2>

      <input
        type="text"
        placeholder="NOMBRE DEL CLIENTE"
        value={nombre}
        onChange={(e) =>
          setData({
            ...data,
            cliente: {
              ...data.cliente,
              nombre: e.target.value.toUpperCase(),
            },
          })
        }
        className="mb-4 p-3 border rounded-lg uppercase"
      />

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="TELÉFONO (OPCIONAL)"
        value={telefono}
        onChange={(e) =>
          setData({
            ...data,
            cliente: {
              ...data.cliente,
              telefono: e.target.value.replace(/\D/g, ""),
            },
          })
        }
        className="mb-4 p-3 border rounded-lg"
      />

      <input
        type="text"
        placeholder="PAÍS"
        value={pais || ""}
        onChange={(e) =>
          setData({
            ...data,
            cliente: {
              ...data.cliente,
              pais: e.target.value,
            },
          })
        }
        className="mb-4 p-3 border rounded-lg"
      />

      <input
        type="text"
        placeholder="PROVINCIA / ESTADO"
        value={provincia || ""}
        onChange={(e) =>
          setData({
            ...data,
            cliente: {
              ...data.cliente,
              provincia: e.target.value,
            },
          })
        }
        className="mb-4 p-3 border rounded-lg"
      />

      <input
        type="text"
        placeholder="LOCALIDAD / CIUDAD"
        value={localidad || ""}
        onChange={(e) =>
          setData({
            ...data,
            cliente: {
              ...data.cliente,
              localidad: e.target.value,
            },
          })
        }
        className="mb-6 p-3 border rounded-lg"
      />

      <button
        disabled={!nombre || !pais || !provincia || !localidad}
        onClick={() => navigate("/activo")}
        className="bg-[#FF7A00] text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-800 transition"
      >
        Continuar
      </button>
    </div>
  );
}