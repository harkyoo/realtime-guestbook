"use client";

import { ImagePlus, PenLine, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEntry, type ActionState } from "@/app/actions";
import { DrawingCanvas } from "./DrawingCanvas";

const initialState: ActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-base font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      <Send className="h-5 w-5" /> {pending ? "등록 중..." : "방명록 등록"}
    </button>
  );
}

export function GuestbookForm() {
  const [state, action] = useActionState(createEntry, initialState);
  const [mode, setMode] = useState<"photo" | "drawing">("drawing");
  const [photoName, setPhotoName] = useState("");
  const [drawingFile, setDrawingFile] = useState<File | null>(null);
  const drawingInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!drawingInputRef.current) return;
    const transfer = new DataTransfer();
    if (drawingFile) transfer.items.add(drawingFile);
    drawingInputRef.current.files = transfer.files;
  }, [drawingFile]);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setPhotoName("");
      setDrawingFile(null);
    }
  }, [state.ok]);

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
      <div className="flex flex-col justify-center">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-amber-800 shadow-sm">
          <Sparkles className="h-4 w-4" /> 행사장과 전시에 어울리는 전자 방명록
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
          사진이나 그림으로 남기는 따뜻한 방문 기록
        </h1>
        <p className="mt-5 text-lg leading-8 text-stone-700">
          닉네임과 짧은 메시지를 적고, 사진을 올리거나 직접 그림을 그려보세요. 등록된 글은 게시판에서 실시간으로 함께 볼 수 있습니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/wall" className="rounded-full border border-amber-300 bg-white px-6 py-3 text-center font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5">
            포스트잇 게시판 보기
          </Link>
        </div>
      </div>

      <form ref={formRef} action={action} className="rounded-[2.2rem] border border-white/80 bg-white/70 p-4 shadow-soft backdrop-blur sm:p-6">
        <div className="rounded-[1.8rem] border border-amber-100 bg-paper/80 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-stone-700">
              이름 / 닉네임
              <input name="nickname" required maxLength={24} placeholder="예: 앨리스" className="rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none ring-amber-300 transition focus:ring-4" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-stone-700">
              짧은 메시지
              <input name="message" required maxLength={180} placeholder="방문 소감을 남겨주세요" className="rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none ring-amber-300 transition focus:ring-4" />
            </label>
          </div>

          <div className="my-5 grid grid-cols-2 gap-2 rounded-full bg-white p-1 shadow-inner">
            <button type="button" onClick={() => setMode("drawing")} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-extrabold transition ${mode === "drawing" ? "bg-ink text-white" : "text-stone-600"}`}>
              <PenLine className="h-5 w-5" /> 그림 그리기
            </button>
            <button type="button" onClick={() => setMode("photo")} className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 font-extrabold transition ${mode === "photo" ? "bg-ink text-white" : "text-stone-600"}`}>
              <ImagePlus className="h-5 w-5" /> 사진 첨부
            </button>
          </div>

          <input ref={drawingInputRef} name="drawing" type="file" accept="image/png" className="hidden" />
          {mode === "drawing" ? (
            <DrawingCanvas onDrawingChange={setDrawingFile} />
          ) : (
            <label className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-amber-300 bg-white/80 p-8 text-center transition hover:bg-white">
              <ImagePlus className="h-12 w-12 text-amber-700" />
              <span className="text-lg font-extrabold">사진을 선택해 주세요</span>
              <span className="text-sm text-stone-500">JPG, PNG, WebP, GIF · 최대 8MB</span>
              <input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? "")} />
              {photoName && <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">{photoName}</span>}
            </label>
          )}

          {state.message && (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${state.ok ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"}`} role="status">
              {state.message}
            </p>
          )}

          <div className="mt-5 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-stone-500">제출하려면 사진 또는 그림 중 하나가 필요합니다.</p>
            <SubmitButton />
          </div>
        </div>
      </form>
    </section>
  );
}
