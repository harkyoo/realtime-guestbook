"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { GuestbookEntry } from "@/types/database";
import { getMediaUrl } from "@/lib/supabase/media";
import { relativeTime } from "@/lib/utils/date";

const rotations = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1", "rotate-0"];
const colors = ["bg-yellow-100", "bg-rose-100", "bg-orange-100", "bg-lime-100", "bg-sky-100"];

type StickyNoteCardProps = {
  entry: GuestbookEntry;
  index: number;
  onOpen: (entry: GuestbookEntry) => void;
};

export function StickyNoteCard({ entry, index, onOpen }: StickyNoteCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className={`group relative flex min-h-72 flex-col rounded-[1.4rem] ${colors[index % colors.length]} p-4 text-left shadow-note transition hover:z-10 hover:-translate-y-2 hover:rotate-0 focus:outline-none focus:ring-4 focus:ring-white/80 ${rotations[index % rotations.length]}`}
    >
      <span className="absolute left-1/2 top-3 h-3 w-14 -translate-x-1/2 rounded-full bg-white/45 shadow-sm" />
      <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-white/70 bg-white/70">
        <Image src={getMediaUrl(entry.thumbnail_path ?? entry.media_path)} alt={`${entry.nickname}님의 ${entry.media_type === "drawing" ? "그림" : "사진"}`} fill className="object-cover transition duration-300 group-hover:scale-105" sizes="(max-width: 768px) 80vw, 280px" />
      </div>
      <div className="mt-4 flex-1">
        <p className="text-sm font-extrabold text-stone-800">{entry.nickname}</p>
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-base leading-7 text-stone-700">{entry.message}</p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs font-bold text-stone-500">
        <span>{relativeTime(entry.created_at)}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/55 px-2 py-1">
          <MessageCircle className="h-3.5 w-3.5" /> {entry.comment_count ?? 0}
        </span>
      </div>
    </button>
  );
}
