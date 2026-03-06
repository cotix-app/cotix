import { useCotix } from "../context/CotixContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { diasRestantes, presupuestosHoy } = useCotix();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-blue-900">Cotix</h1>

        <p className="text-gray-600">
          Días restantes de prueba: <strong>{diasRestantes}</strong>
        </p>

        <p className="text-gray-600">
          Presupuestos usados hoy:{" "}
          <strong>
            {presupuestosHoy}
          </strong>
        </p>

        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate("/cliente")}
            className="bg-[#FF7A00] text-black font-bold py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Crear Presupuesto
          </button>

          <button
            onClick={() => navigate("/historial")}
            className="bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Historial
          </button>
        </div>
      </div>
    </div>
  );
}