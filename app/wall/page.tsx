import { StickyNoteGrid } from "@/components/wall/StickyNoteGrid";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GuestbookEntry } from "@/types/database";

export const dynamic = "force-dynamic";

async function getEntries(): Promise<GuestbookEntry[]> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("entries_with_comment_counts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(80);

  if (error) {
    console.error("Failed to load entries", error.message);
    return [];
  }

  return data ?? [];
}

export default async function WallPage() {
  const entries = await getEntries();
  return <StickyNoteGrid initialEntries={entries} envReady={hasSupabaseEnv()} />;
}
