"use client";

import Link from "next/link";
import { PlusCircle, RefreshCw, Wifi } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { GuestbookEntry } from "@/types/database";
import { StickyNoteCard } from "./StickyNoteCard";
import { EntryDetailModal } from "./EntryDetailModal";

type StickyNoteGridProps = {
  initialEntries: GuestbookEntry[];
  envReady: boolean;
};

export function StickyNoteGrid({ initialEntries, envReady }: StickyNoteGridProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [selected, setSelected] = useState<GuestbookEntry | null>(null);
  const [liveError, setLiveError] = useState("");

  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  useEffect(() => {
    if (!envReady) return;
    const supabase = createBrowserClient();
    const channel = supabase
      .channel("guestbook_entries")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guestbook_entries" }, (payload) => {
        const incoming = { ...(payload.new as GuestbookEntry), comment_count: 0 };
        setEntries((current) => (current.some((entry) => entry.id === incoming.id) ? current : [incoming, ...current]));
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") setLiveError("실시간 연결에 문제가 있어요. 잠시 후 다시 시도해 주세요.");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [envReady]);

  const bumpCommentCount = useCallback((entryId: string) => {
    setEntries((current) =>
      current.map((entry) => (entry.id === entryId ? { ...entry, comment_count: (entry.comment_count ?? 0) + 1 } : entry)),
    );
    setSelected((current) => (current?.id === entryId ? { ...current, comment_count: (current.comment_count ?? 0) + 1 } : current));
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6 flex flex-col justify-between gap-4 rounded-[2rem] bg-white/75 p-5 shadow-soft backdrop-blur sm:flex-row sm:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-extrabold text-green-800">
            <Wifi className="h-4 w-4" /> 실시간 게시판
          </p>
          <h1 className="mt-3 text-3xl font-black text-ink sm:text-5xl">포스트잇 방명록</h1>
          <p className="mt-2 text-stone-600">새 글과 댓글이 새로고침 없이 바로 반영됩니다.</p>
        </div>
        <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5">
          <PlusCircle className="h-5 w-5" /> 새 방명록 쓰기
        </Link>
      </header>

      {!envReady && (
        <div className="mb-5 rounded-3xl bg-rose-50 p-5 font-bold text-rose-800 ring-1 ring-rose-100">
          Supabase 환경 변수가 없어 데이터를 불러올 수 없습니다. `.env.local`을 설정해 주세요.
        </div>
      )}
      {liveError && (
        <div className="mb-5 flex items-center gap-2 rounded-3xl bg-amber-50 p-5 font-bold text-amber-800 ring-1 ring-amber-100">
          <RefreshCw className="h-5 w-5" /> {liveError}
        </div>
      )}

      <section className="board-texture min-h-[64vh] rounded-[2.5rem] border-[10px] border-amber-900/25 p-5 shadow-soft sm:p-8">
        {entries.length === 0 ? (
          <div className="flex min-h-[46vh] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-white/60 bg-white/25 p-8 text-center text-white">
            <p className="text-2xl font-black">아직 붙어 있는 포스트잇이 없어요</p>
            <p className="mt-2 max-w-md text-white/85">첫 번째 방문 기록을 남기면 이 게시판에 따뜻한 메모가 붙습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {entries.map((entry, index) => (
              <StickyNoteCard key={entry.id} entry={entry} index={index} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>
      <EntryDetailModal entry={selected} onClose={() => setSelected(null)} onCommentInserted={bumpCommentCount} />
    </main>
  );
}
