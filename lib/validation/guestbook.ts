import { z } from "zod";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const entrySchema = z.object({
  nickname: z.string().trim().min(1, "이름 또는 닉네임을 입력해 주세요.").max(24, "닉네임은 24자 이내로 입력해 주세요."),
  message: z.string().trim().min(1, "짧은 메시지를 입력해 주세요.").max(180, "메시지는 180자 이내로 입력해 주세요."),
  mediaType: z.enum(["photo", "drawing"]),
});

export const commentSchema = z.object({
  entryId: z.string().uuid(),
  nickname: z.string().trim().min(1, "닉네임을 입력해 주세요.").max(24, "닉네임은 24자 이내로 입력해 주세요."),
  message: z.string().trim().min(1, "댓글을 입력해 주세요.").max(160, "댓글은 160자 이내로 입력해 주세요."),
});
