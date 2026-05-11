import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "./config";

export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
