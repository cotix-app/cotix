import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCotix } from "../context/CotixContext";

export default function Historial() {
  const { presupuestos, setPresupuestos } = useCotix();
  const navigate = useNavigate();

  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  const eliminarPresupuesto = (id: string) => {
    const nuevos = presupuestos.filter((p) => p.id !== id);
    setPresupuestos(nuevos);
  };
  const { setData, setEditingId } = useCotix();

  const editarPresupuesto = (presupuesto: any) => {
    setData(presupuesto.data);
    setEditingId(presupuesto.id);
    navigate("/cliente");
  };

  const cambiarEstado = (id: string, nuevoEstado: string) => {
    const actualizados = presupuestos.map((p) =>
      p.id === id ? { ...p, estado: nuevoEstado } : p,
    );
    setPresupuestos(actualizados);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "text-green-600";
      case "rechazado":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  // 🔥 Ordenados por fecha (más nuevo primero)
  const ordenados = [...presupuestos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  // 🔥 Filtro por estado + búsqueda por cliente
  const filtrados = ordenados.filter((p) => {
    const estado = p.estado || "pendiente";
    const coincideEstado = filtroEstado === "todos" || estado === filtroEstado;

    const coincideBusqueda = p.data.cliente.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  // 🔥 Contadores
  const total = presupuestos.length;
  const pendientes = presupuestos.filter(
    (p) => (p.estado || "pendiente") === "pendiente",
  ).length;
  const aprobados = presupuestos.filter((p) => p.estado === "aprobado").length;
  const rechazados = presupuestos.filter(
    (p) => p.estado === "rechazado",
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Volver
      </button>

      <h2 className="text-2xl font-bold mb-6 text-blue-900">
        Historial de Presupuestos
      </h2>

      {/* 🔥 DASHBOARD CONTADORES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-bold text-lg">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-yellow-600">Pendientes</p>
          <p className="font-bold text-lg">{pendientes}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-green-600">Aprobados</p>
          <p className="font-bold text-lg">{aprobados}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-sm text-red-600">Rechazados</p>
          <p className="font-bold text-lg">{rechazados}</p>
        </div>
      </div>

      {/* 🔥 FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobado">Aprobados</option>
          <option value="rechazado">Rechazados</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="p-2 border rounded flex-1"
        />
      </div>

      {!filtrados || filtrados.length === 0 ? (
        <p className="text-gray-500">No hay presupuestos que coincidan.</p>
      ) : (
        <div className="space-y-4">
          {filtrados.map((p) => {
            const totalPresupuesto = (p.data?.tareas || []).reduce(
              (sum: number, t: any) => sum + (Number(t.precio) || 0),
              0,
            );

            const estado = p.estado || "pendiente";

            return (
              <div key={p.id} className="bg-white p-4 rounded-xl shadow-md">
                <p className="font-semibold">
                  Cliente: {p.data.cliente.nombre}
                </p>

                <p className="text-sm text-gray-500">
                  Fecha: {new Date(p.fecha).toLocaleString()}
                </p>

                <p className="mt-2 font-bold">Total: ${totalPresupuesto}</p>

                <p className={`mt-1 font-semibold ${getEstadoColor(estado)}`}>
                  Estado: {estado.toUpperCase()}
                </p>

                <div className="flex gap-3 mt-3 flex-wrap">
                  <button
                    onClick={() => {
                      localStorage.setItem("cotixData", JSON.stringify(p.data));
                      window.location.href = "/resumen";
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => editarPresupuesto(p)}
                    className="text-blue-500 text-sm"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarPresupuesto(p.id)}
                    className="text-red-600 text-sm"
                  >
                    Eliminar
                  </button>

                  {estado !== "aprobado" && (
                    <button
                      onClick={() => cambiarEstado(p.id, "aprobado")}
                      className="text-green-600 text-sm"
                    >
                      Aprobar
                    </button>
                  )}

                  {estado !== "rechazado" && (
                    <button
                      onClick={() => cambiarEstado(p.id, "rechazado")}
                      className="text-red-500 text-sm"
                    >
                      Rechazar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
