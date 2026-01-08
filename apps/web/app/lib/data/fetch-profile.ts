import { supabase } from "~/lib/supabase";

export async function updateProfile(profile: { userId: string; fullName: string; email: string }) {
  const { data, error } = await supabase.rpc("update_user_profile", {
    p_user_id: profile.userId,
    p_full_name: profile.fullName,
    email: profile.email,
  });

  if (error) throw error;
  return data;
}
export async function fetchProfile() {
  const { data, error } = await supabase.from("user_settings").select("*").single();

  if (error) {
    return {
      id: "seed-uuid",
      user_id: "current-user",
      full_name: "Demo User",
      email: "demo@biteuk.com",
      role: "manager",
    };
  }

  return data;
}
