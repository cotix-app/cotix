import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  localStorage.setItem("cotixUser", email);

  if (data.user) {
    const { data: empresa } = await supabase
      .from("tecnicos_empresa")
      .select("empresa_id, rol")
      .eq("user_id", data.user.id)
      .single();

    if (empresa) {
      localStorage.setItem("cotixEmpresaId", empresa.empresa_id || "");
      localStorage.setItem("cotixEmpresaRol", empresa.rol || "tecnico");
    } else {
      localStorage.removeItem("cotixEmpresaId");
      localStorage.removeItem("cotixEmpresaRol");
    }
  }

  return data;
}

export async function register(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function logout() {
  await supabase.auth.signOut();

  localStorage.removeItem("cotixUser");
  localStorage.removeItem("cotixEmpresaId");
  localStorage.removeItem("cotixEmpresaRol");
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) throw error;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();

  return data.user;
}

export async function getEmpresa() {
  const empresa_id = localStorage.getItem("cotixEmpresaId");
  const rol = localStorage.getItem("cotixEmpresaRol");

  return {
    empresa_id,
    rol,
  };
}
