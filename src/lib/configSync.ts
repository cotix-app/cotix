import { supabase } from "./supabase";
import { getUser } from "./auth";

export async function guardarConfig(config:any){

  const user = await getUser();
  
  if(!user?.email) return;

  await supabase
    .from("config_usuario")
    .upsert({
      email: user.email,
      empresa: config.empresa,
      mostrar_fecha: config.mostrarFechaHora,
      validez_dias: config.validezDias,
      logo_url: config.logo_url || null
    });

}