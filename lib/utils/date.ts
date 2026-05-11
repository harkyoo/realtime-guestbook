import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function relativeTime(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
}
