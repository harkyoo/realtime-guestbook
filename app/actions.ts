"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mediaBucket } from "@/lib/supabase/config";
import { ALLOWED_IMAGE_TYPES, entrySchema, MAX_IMAGE_BYTES, commentSchema } from "@/lib/validation/guestbook";
import { mediaExtension } from "@/lib/supabase/media";

export type ActionState = {
  ok: boolean;
  message: string;
};

export async function createEntry(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { ok: false, message: "Supabase 환경 변수가 설정되지 않았습니다." };

  const photo = formData.get("photo");
  const drawing = formData.get("drawing");
  const hasDrawing = drawing instanceof File && drawing.size > 0;
  const hasPhoto = photo instanceof File && photo.size > 0;
  const mediaFile = hasPhoto ? photo : hasDrawing ? drawing : null;
  const mediaType = hasPhoto ? "photo" : hasDrawing ? "drawing" : null;

  if (!mediaFile || !mediaType) return { ok: false, message: "사진 또는 그림을 하나 이상 등록해 주세요." };
  if (!ALLOWED_IMAGE_TYPES.includes(mediaFile.type)) return { ok: false, message: "JPG, PNG, WebP, GIF 이미지만 사용할 수 있습니다." };
  if (mediaFile.size > MAX_IMAGE_BYTES) return { ok: false, message: "이미지는 8MB 이하로 등록해 주세요." };

  const parsed = entrySchema.safeParse({
    nickname: formData.get("nickname"),
    message: formData.get("message"),
    mediaType,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요." };

  const id = crypto.randomUUID();
  const path = `entries/${id}.${mediaExtension(mediaFile)}`;
  const { error: uploadError } = await supabase.storage.from(mediaBucket).upload(path, mediaFile, {
    cacheControl: "31536000",
    contentType: mediaFile.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, message: `이미지 저장에 실패했습니다: ${uploadError.message}` };

  const { error: insertError } = await supabase.from("guestbook_entries").insert({
    id,
    nickname: parsed.data.nickname,
    message: parsed.data.message,
    media_type: parsed.data.mediaType,
    media_path: path,
    thumbnail_path: null,
  });
  if (insertError) return { ok: false, message: `방명록 등록에 실패했습니다: ${insertError.message}` };

  revalidatePath("/");
  revalidatePath("/wall");
  return { ok: true, message: "방명록이 등록되었습니다." };
}

export async function createComment(_: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { ok: false, message: "Supabase 환경 변수가 설정되지 않았습니다." };

  const parsed = commentSchema.safeParse({
    entryId: formData.get("entryId"),
    nickname: formData.get("nickname"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "댓글 입력값을 확인해 주세요." };

  const { error } = await supabase.from("comments").insert({
    entry_id: parsed.data.entryId,
    nickname: parsed.data.nickname,
    message: parsed.data.message,
  });
  if (error) return { ok: false, message: `댓글 등록에 실패했습니다: ${error.message}` };

  revalidatePath("/wall");
  return { ok: true, message: "댓글이 등록되었습니다." };
}
