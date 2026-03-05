import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useCotix } from "../context/CotixContext";
import  StepProgress from "./StepProgress";
import UpdateToast from "./UpdateToast";

export default function Layout() {
  const navigate = useNavigate();
  const { data } = useCotix();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Barra superior */}
      <header className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1
          className="font-bold text-lg cursor-pointer"
          onClick={() => navigate("/")}
        >
          {data.config.empresa}
        </h1>

        <div className="space-x-4 text-sm">
          <button
            onClick={() => navigate("/")}
            className="hover:underline"
          >
            Inicio
          </button>

          <button
            onClick={() => navigate("/configuracion")}
            className="hover:underline"
          >
            Configuración
          </button>
        </div>
      </header>

      <StepProgress />

      {/* Contenido dinámico */}
      <main className="flex-1 relative z-0">
        <div key={location.pathname} className="animate-fade">
        <Outlet />
        </div>
      </main>
      <UpdateToast/>

    </div>
  );
}

