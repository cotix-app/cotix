import { useEffect, useState } from "react";

export default function CotixToast() {

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {

    const updateHandler = () =>
      setMessage("🚀 Nueva versión disponible");

    const offlineHandler = () =>
      setMessage("⚠️ Sin conexión. Cotix funciona offline");

    const onlineHandler = () =>
      setMessage("🌐 Conexión restaurada");

    const savedHandler = () =>
      setMessage("💾 PDF Generado");

    window.addEventListener("cotix-update", updateHandler);
    window.addEventListener("cotix-offline", offlineHandler);
    window.addEventListener("cotix-online", onlineHandler);
    window.addEventListener("cotix-saved", savedHandler);

    return () => {
      window.removeEventListener("cotix-update", updateHandler);
      window.removeEventListener("cotix-offline", offlineHandler);
      window.removeEventListener("cotix-online", onlineHandler);
      window.removeEventListener("cotix-saved", savedHandler);
    };

  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-toast">
      <div className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow-xl">
        {message}
      </div>
    </div>
  );
}