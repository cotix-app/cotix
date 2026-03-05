import { useEffect, useState } from "react";

export default function UpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("cotix-update", handler);

    return () => window.removeEventListener("cotix-update", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg flex gap-3 items-center">
      <span>Nueva versión de Cotix disponible</span>

      <button
        onClick={() => window.location.reload()}
        className="bg-white text-blue-700 px-3 py-1 rounded-md font-semibold"
      >
        Actualizar
      </button>
    </div>
  );
}