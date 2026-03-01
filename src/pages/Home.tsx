import { useNavigate } from "react-router-dom";
import { useCotix } from "../context/CotixContext";
import { appConfig } from "../config/appConfig";

export default function Home() {
  const navigate = useNavigate();
  const { puedeCrearHoy, trialActivo, diasRestantes } =
    useCotix();

  const hoy = new Date().toISOString().split("T")[0];
  const registro = JSON.parse(
    localStorage.getItem("cotixRegistroDiario") || "{}"
  );
  const usadosHoy = registro[hoy] || 0;

  const handleCrear = () => {
    if (!trialActivo) {
      alert("El período de prueba finalizó.");
      return;
    }

    if (!puedeCrearHoy()) {
      alert(
        `Ya creaste ${appConfig.limiteDiarioFree} presupuestos hoy.`
      );
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

        <p className="text-sm text-gray-500 mb-1">
          Días restantes de prueba: {diasRestantes}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Presupuestos usados hoy: {usadosHoy}/
          {appConfig.limiteDiarioFree}
        </p>

        <button
          onClick={handleCrear}
          className="bg-blue-900 text-white py-3 px-4 rounded-xl w-full mb-3"
        >
          Crear Presupuesto
        </button>

        <button
          onClick={() => navigate("/historial")}
          className="bg-gray-800 text-white py-3 px-4 rounded-xl w-full"
        >
          Historial
        </button>
      </div>
    </div>
  );
}