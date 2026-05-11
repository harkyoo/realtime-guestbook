import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "./config";

export function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
