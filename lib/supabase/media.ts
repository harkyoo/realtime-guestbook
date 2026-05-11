import { mediaBucket } from "./config";

export function getMediaUrl(path: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return "";
  return `${url}/storage/v1/object/public/${mediaBucket}/${path}`;
}

export function mediaExtension(file: File, fallback = "png") {
  const subtype = file.type.split("/")[1]?.replace("jpeg", "jpg");
  return subtype || fallback;
}
