import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";

export default function Tareas() {
  const navigate = useNavigate();
  const { data, setData } = useCotix();
  const tareas = data.tareas;

  const agregarTarea = () => {
    setData({
      ...data,
      tareas: [
        ...tareas,
        { descripcion: "", detalle: "", precio: 0 },
      ],
    });
  };

  const actualizarTarea = (
    index: number,
    campo: "descripcion" | "detalle" | "precio",
    valor: string
  ) => {
    const nuevasTareas = [...tareas];

    if (campo === "descripcion") {
      nuevasTareas[index].descripcion =
        valor.toUpperCase();
    } else if (campo === "detalle") {
      nuevasTareas[index].detalle =
        valor.toUpperCase();
    } else {
      const limpio = valor.replace(/\D/g, "");
      nuevasTareas[index].precio =
        limpio === "" ? 0 : Number(limpio);
    }
    setData({
      ...data,
      tareas: nuevasTareas,
    });
  };

  const eliminarTarea = (index: number) => {
    const nuevasTareas = tareas.filter(
      (_, i) => i !== index
    );

    setData({
      ...data,
      tareas: nuevasTareas,
    });
  };

  const total = tareas.reduce(
    (sum, t) => sum + t.precio,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-900"
      >
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        Paso 4: Tareas
      </h2>

      <div className="space-y-4 mb-6">
        {tareas.map((tarea, index) => (

          <div
            key={index}
            className="bg-white rounded-xl p-4 shadow space-y-3"
          ><div className="flex justify-between items-center">
              <div className="font-semibold text-blue-900">
                Ítem {index + 1}
              </div>

              <button
                type="button"
                onClick={() => eliminarTarea(index)}
                className="text-red-500 text-sm"
              >
                Eliminar
              </button>
            </div>


            <input
              type="text"
              placeholder="DESCRIPCIÓN"
              value={tarea.descripcion}
              onChange={(e) =>
                actualizarTarea(
                  index,
                  "descripcion",
                  e.target.value
                )
              }
              className="w-full p-3 border rounded-lg uppercase"
            />

            <input
              type="text"
              placeholder="DETALLE (OPCIONAL)"
              value={tarea.detalle}
              onChange={(e) =>
                actualizarTarea(
                  index,
                  "detalle",
                  e.target.value
                )
              }
              className="w-full p-2 border rounded-lg text-sm uppercase"
            />

            <input
              type="text"
              inputMode="numeric"
              placeholder="PRECIO"
              value={tarea.precio === 0 ? "" : tarea.precio}
              onChange={(e) =>
                actualizarTarea(
                  index,
                  "precio",
                  e.target.value
                )
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        ))}
      </div>

      <button
        onClick={agregarTarea}
        className="mb-6 bg-green-500 text-white py-2 rounded-lg"
      >
        + Agregar tarea
      </button>

      <div className="text-lg font-bold mb-4">
        Total: ${total}
      </div>

      <button
        disabled={tareas.length === 0 || total === 0}
        onClick={() => navigate("/resumen")}
        className="bg-[#FF7A00] text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-800 transition"
      >
        Continuar
      </button>
    </div>
  );
}