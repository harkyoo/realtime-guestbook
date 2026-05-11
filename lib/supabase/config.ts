export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const mediaBucket = process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET ?? "guestbook-media";

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
