import { useState } from "react";
import { useCotix } from "../context/CotixContext";
import { guardarConfig } from "../lib/configSync";
import { supabase } from "../lib/supabase";

export default function Configuracion() {

  const { data, setData } = useCotix();

  const [configLocal, setConfigLocal] = useState(data.config);
  const [uploading, setUploading] = useState(false);

  const handleChange = (campo: string, valor: any) => {
    setConfigLocal({
      ...configLocal,
      [campo]: valor
    });
  };

  // ---------- SUBIR LOGO ----------
 const subirLogo = async (file: File) => {

  try {

    setUploading(true);

    // BORRAR LOGO ANTERIOR
    if (configLocal.logo_url) {

      const parts = configLocal.logo_url.split("/logos/");
      const oldFile = parts[1];

      if (oldFile) {
        await supabase
          .storage
          .from("logos")
          .remove([oldFile]);
      }

    }

    const fileName = `logo_${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("logos")
      .upload(fileName, file, { upsert: true });

    if (error) {
      alert("Error subiendo logo");
      return;
    }

    const { data:urlData } = supabase
      .storage
      .from("logos")
      .getPublicUrl(fileName);

    const url = urlData.publicUrl;

    setConfigLocal({
      ...configLocal,
      logo_url: url
    });

  } catch (e) {

    console.error(e);
    alert("Error subiendo logo");

  }

  setUploading(false);

};

  const handleLogo = async (e:any) => {

    const file = e.target.files[0];

    if(!file) return;

    await subirLogo(file);

  };

  // ---------- GUARDAR ----------
  const guardar = async () => {

    const nuevoData = {
      ...data,
      config: configLocal
    };

    setData(nuevoData);

    await guardarConfig(configLocal);

    alert("Configuración guardada");

  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">

        <h2 className="text-xl font-bold text-center">
          Configuración
        </h2>

        {/* Empresa */}
        <div>

          <label className="block text-sm font-medium">
            Nombre de empresa
          </label>

          <input
            type="text"
            value={configLocal.empresa}
            onChange={(e)=>
              handleChange("empresa",e.target.value.toUpperCase())
            }
            className="w-full border p-2 rounded mt-1"
          />

        </div>


        {/* LOGO */}

        <div>

          <label className="block text-sm font-medium mb-2">
            Logo de empresa
          </label>

          {configLocal.logo_url && (
            <img
              src={configLocal.logo_url}
              className="h-20 mb-2 object-contain"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleLogo}
            disabled={uploading}
          />

        </div>


        {/* Mostrar fecha */}

        <div className="flex items-center justify-between">

          <span>Mostrar fecha en PDF</span>

          <input
            type="checkbox"
            checked={configLocal.mostrarFechaHora}
            onChange={(e)=>
              handleChange("mostrarFechaHora",e.target.checked)
            }
          />

        </div>


        {/* Validez */}

        <div>

          <label className="block text-sm font-medium">
            Días de validez
          </label>

          <input
            type="number"
            min="0"
            value={configLocal.validezDias}
            onChange={(e)=>
              handleChange(
                "validezDias",
                Number(e.target.value)
              )
            }
            className="w-full border p-2 rounded mt-1"
          />

        </div>


        {/* GUARDAR */}

        <button
          onClick={guardar}
          className="w-full bg-[#FF7A00] text-white py-2 rounded-lg mt-4"
        >
          Guardar configuración
        </button>

      </div>

    </div>
  );
}