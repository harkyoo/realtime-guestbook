"use client";

import { Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createComment, type ActionState } from "@/app/actions";

const initialState: ActionState = { ok: false, message: "" };

function CommentSubmit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-full bg-ink px-4 py-3 font-extrabold text-white disabled:opacity-60">
      <Send className="h-4 w-4" />
      <span className="sr-only">댓글 등록</span>
    </button>
  );
}

export function CommentForm({ entryId }: { entryId: string }) {
  const [state, action] = useActionState(createComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="mt-4 space-y-3 rounded-3xl bg-amber-50 p-3">
      <input type="hidden" name="entryId" value={entryId} />
      <div className="grid gap-2 sm:grid-cols-[9rem_1fr_auto]">
        <input name="nickname" required maxLength={24} placeholder="닉네임" className="rounded-2xl border border-amber-200 px-3 py-3 outline-none ring-amber-300 focus:ring-4" />
        <input name="message" required maxLength={160} placeholder="댓글로 반응하기" className="rounded-2xl border border-amber-200 px-3 py-3 outline-none ring-amber-300 focus:ring-4" />
        <CommentSubmit />
      </div>
      {state.message && <p className={`text-sm font-bold ${state.ok ? "text-green-700" : "text-rose-700"}`}>{state.message}</p>}
    </form>
  );
}
