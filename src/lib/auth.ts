import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  localStorage.setItem("cotixUser", email);

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
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) throw error;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();

  return data.user;
}
