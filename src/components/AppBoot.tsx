import { useEffect, useState } from "react";

export default function AppBoot({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    const handler = () => setUpdate(true);
    window.addEventListener("cotix-update", handler);

    return () => {
      clearTimeout(splashTimer);
      window.removeEventListener("cotix-update", handler);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-700">
        <div className="flex flex-col items-center gap-4 animate-fade">
          <img
            src="/icon-512.png"
            className="w-24 h-24 animate-scale"
          />

          <h1 className="text-white text-2xl font-semibold">
            Cotix
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {update && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-4 py-3 rounded-xl shadow-lg flex gap-3 items-center">
          <span>Nueva versión disponible</span>

          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-700 px-3 py-1 rounded"
          >
            Actualizar
          </button>
        </div>
      )}
    </>
  );
}