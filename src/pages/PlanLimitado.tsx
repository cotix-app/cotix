import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";

export default function Home() {
  const navigate = useNavigate();
  const {
    puedeCrearHoy,
    trialActivo,
    diasRestantes,
    plan,
  } = useCotix();

  const hoy = new Date().toISOString().split("T")[0];
  const registro = JSON.parse(
    localStorage.getItem("cotixRegistroDiario") || "{}"
  );
  const usadosHoy = registro[hoy] || 0;

  const handleCrear = () => {
    if (!trialActivo && plan === "free") {
      navigate("/plan-limitado");
      return;
    }

    if (!puedeCrearHoy) {
      alert("Ya creaste los presupuestos delplan Frre de hoy.");
      return;
    }

    navigate("/cliente");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          Cotix
        </h1>

        {plan === "free" && (
          <>
            <p className="text-sm text-gray-500 mb-1">
              Días restantes de prueba: {diasRestantes}
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Presupuestos usados hoy: {usadosHoy}
            </p>
          </>
        )}

        {plan === "pro" && (
          <p className="text-sm text-green-600 mb-6 font-semibold">
            Plan PRO activo — Sin límites 🚀
          </p>
        )}

        <button
          onClick={handleCrear}
          className="bg-blue-900 text-white py-3 px-4 rounded-xl w-full mb-3"
        >
          Crear Presupuesto
        </button>

        <button
          onClick={() => navigate("/historial")}
          className="bg-gray-800 text-white py-3 px-4 rounded-xl w-full mb-3"
        >
          Historial
        </button>

        {plan === "free" && (
          <button
            onClick={() => navigate("/plan-limitado")}
            className="bg-yellow-500 text-white py-3 px-4 rounded-xl w-full"
          >
            Actualizar a PRO
          </button>
        )}
      </div>
    </div>
  );
}