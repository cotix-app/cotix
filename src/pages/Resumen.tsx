import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useCotix } from "../context/CotixContext";

export default function Resumen() {
  const navigate = useNavigate();
  const { data, setData, presupuestos, setPresupuestos, registrarCreacionHoy } =
    useCotix();

  const total = data.tareas.reduce((sum, t) => sum + Number(t.precio || 0), 0);

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 25;

    // ===== HEADER =====
    doc.setFillColor(25, 45, 85);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(data.config.empresa || "SERVICIO TÉCNICO", 20, 25);

    doc.setFontSize(12);
    doc.text("PRESUPUESTO", pageWidth - 20, 20, { align: "right" });

    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - 20, 28, {
      align: "right",
    });

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    y = 55;

    // ===== CLIENTE Y ACTIVO =====
    doc.setFontSize(12);

    doc.text("Cliente:", 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(data.cliente.nombre, 45, y);
    doc.setFont("helvetica", "normal");

    y += 10;

    doc.text("Equipo:", 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(data.activo.tipo || "-", 45, y);
    doc.setFont("helvetica", "normal");

    y += 15;

    // ===== TABLA HEADER =====
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 7, pageWidth - 40, 10, "F");

    doc.text("Detalle", 25, y);
    doc.text("Precio", pageWidth - 25, y, {
      align: "right",
    });

    y += 12;

    // ===== TAREAS =====
    data.tareas.forEach((t, index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${t.descripcion}`, 25, y);
      doc.setFont("helvetica", "normal");

      doc.text(`$${t.precio}`, pageWidth - 25, y, {
        align: "right",
      });

      y += 8;

      if (t.detalle && t.detalle.trim() !== "") {
        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(t.detalle, 30, y, { maxWidth: pageWidth - 60 });
        doc.setTextColor(0);
        doc.setFontSize(12);
        y += 10;
      }

      y += 5;
    });

    // ===== BLOQUE FINAL ABAJO DE LA PAGINA =====

    const bloqueFinalY = pageHeight - 40;

    // Línea separadora arriba del bloque final
    doc.setDrawColor(200);
    doc.line(20, bloqueFinalY - 15, pageWidth - 20, bloqueFinalY - 15);

    // Fondo azul total
    doc.setFillColor(25, 45, 85);
    doc.rect(pageWidth - 90, bloqueFinalY - 10, 70, 20, "F");

    // Texto total
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL: $${total}`, pageWidth - 55, bloqueFinalY + 2, {
      align: "center",
    });

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL: $${total}`, pageWidth - 55, y + 2, { align: "center" });

    doc.setTextColor(0);
    doc.setFont("helvetica", "normal");

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generado con Cotix-App", pageWidth / 2, pageHeight - 5, {
      align: "center",
    });

    doc.save(`${data.cliente.nombre}_Presupuesto.pdf`);

    const nuevoPresupuesto = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      estado: "pendiente",
      data,
    };

    setPresupuestos([...presupuestos, nuevoPresupuesto]);
    registrarCreacionHoy();

    const nuevoData = {
      cliente: { nombre: "", telefono: "" },
      activo: { tipo: "" },
      problemas: [],
      tareas: [],
      config: data.config,
    };

    setData(nuevoData);
    localStorage.setItem("cotixData", JSON.stringify(nuevoData));

    navigate("/");
    window.dispatchEvent(new Event("cotix-saved"))

  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Volver
      </button>

      <div className="bg-white p-10 rounded-xl shadow-xl max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-10">
          Resumen del Presupuesto
        </h2>

        <div className="mb-6 text-lg space-y-1">
          <p>
            <strong>Cliente:</strong> {data.cliente.nombre}
          </p>

          <p>
            <strong>Equipo:</strong> {data.activo.tipo}
          </p>
        </div>

        <div className="mb-10">
          <div className="flex justify-between font-semibold border-b pb-2">
            <span>Detalle</span>
            <span>Precio</span>
          </div>

          <div className="mt-4 space-y-5">
            {data.tareas.map((t, index) => (
              <div key={index}>
                <div className="flex justify-between font-semibold">
                  <span>
                    {index + 1}. {t.descripcion}
                  </span>
                  <span>${t.precio}</span>
                </div>

                {t.detalle && t.detalle.trim() !== "" && (
                  <p className="text-sm text-gray-500 mt-1 ml-4">{t.detalle}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-right text-3xl font-bold text-blue-900 mb-10">
          TOTAL: ${total}
        </div>

        <button
          onClick={generarPDF}
          className="bg-blue-900 text-white py-3 px-4 rounded-xl w-full text-lg"
        >
          Generar PDF
        </button>
        
      </div>
    </div>
  );
}
