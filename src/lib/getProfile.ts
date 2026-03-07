import { supabase } from "./supabase";

export async function getProfile() {

  const { data: userData } = await supabase.auth.getUser();

  const user = userData.user;

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data;

}