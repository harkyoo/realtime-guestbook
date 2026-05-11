"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { getMediaUrl } from "@/lib/supabase/media";
import { relativeTime } from "@/lib/utils/date";
import { Comment, GuestbookEntry } from "@/types/database";
import { CommentForm } from "@/components/comments/CommentForm";

type EntryDetailModalProps = {
  entry: GuestbookEntry | null;
  onClose: () => void;
  onCommentInserted: (entryId: string) => void;
};

export function EntryDetailModal({ entry, onClose, onCommentInserted }: EntryDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!entry) return;
    const supabase = createBrowserClient();
    setLoading(true);
    setError("");
    supabase
      .from("comments")
      .select("*")
      .eq("entry_id", entry.id)
      .order("created_at", { ascending: true })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        setComments(data ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`comments:${entry.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `entry_id=eq.${entry.id}` },
        (payload) => {
          const incoming = payload.new as Comment;
          setComments((current) => (current.some((comment) => comment.id === incoming.id) ? current : [...current, incoming]));
          onCommentInserted(entry.id);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [entry, onCommentInserted]);

  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-stone-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div className="mx-auto grid max-h-[94vh] w-full max-w-5xl overflow-hidden rounded-t-[2rem] bg-white shadow-soft sm:rounded-[2rem] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative min-h-[45vh] bg-stone-100 lg:min-h-[75vh]">
          <Image src={getMediaUrl(entry.media_path)} alt={`${entry.nickname}님의 원본 이미지`} fill className="object-contain" sizes="(max-width: 1024px) 100vw, 55vw" />
        </div>
        <div className="flex max-h-[49vh] flex-col overflow-hidden p-5 sm:p-6 lg:max-h-[75vh]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-amber-700">{entry.media_type === "drawing" ? "그림 방명록" : "사진 방명록"}</p>
              <h2 className="mt-1 text-2xl font-black text-ink">{entry.nickname}</h2>
              <p className="text-sm font-bold text-stone-400">{relativeTime(entry.created_at)}</p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full bg-stone-100 p-3 text-stone-600 hover:bg-stone-200" aria-label="닫기">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 whitespace-pre-wrap rounded-3xl bg-paper p-4 text-lg leading-8 text-stone-800">{entry.message}</p>
          <div className="mt-5 flex-1 overflow-y-auto pr-1">
            <h3 className="font-black text-ink">댓글 {comments.length}개</h3>
            {loading && <p className="mt-4 rounded-2xl bg-stone-50 p-4 text-stone-500">댓글을 불러오는 중입니다...</p>}
            {error && <p className="mt-4 rounded-2xl bg-rose-50 p-4 font-bold text-rose-700">댓글을 불러오지 못했습니다: {error}</p>}
            {!loading && !error && comments.length === 0 && <p className="mt-4 rounded-2xl bg-stone-50 p-4 text-stone-500">아직 댓글이 없어요. 첫 반응을 남겨보세요.</p>}
            <ul className="mt-3 space-y-3">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-amber-100">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-extrabold text-stone-800">{comment.nickname}</p>
                    <p className="text-xs font-bold text-stone-400">{relativeTime(comment.created_at)}</p>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap leading-7 text-stone-700">{comment.message}</p>
                </li>
              ))}
            </ul>
          </div>
          <CommentForm entryId={entry.id} />
        </div>
      </div>
    </div>
  );
}
