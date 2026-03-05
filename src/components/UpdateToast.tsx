import { useEffect, useState } from "react";

export default function UpdateToast() {

  const [show, setShow] = useState(false);

  useEffect(() => {

    const handler = () => setShow(true);

    window.addEventListener("cotix-update", handler);

    return () => window.removeEventListener("cotix-update", handler);

  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast">

      <div className="flex items-center gap-4 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl">

        <span className="font-medium">
          🚀 Nueva versión de Cotix disponible
        </span>

        <button
          onClick={() => window.location.reload()}
          className="bg-white text-blue-600 px-3 py-1 rounded-md font-semibold"
        >
          Actualizar
        </button>

      </div>

    </div>
  );
}