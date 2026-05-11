export type MediaType = "photo" | "drawing";

export type GuestbookEntry = {
  id: string;
  nickname: string;
  message: string;
  media_type: MediaType;
  media_path: string;
  thumbnail_path: string | null;
  created_at: string;
  comment_count?: number;
};

export type Comment = {
  id: string;
  entry_id: string;
  nickname: string;
  message: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      guestbook_entries: {
        Row: Omit<GuestbookEntry, "comment_count">;
        Insert: Omit<GuestbookEntry, "id" | "created_at" | "comment_count"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<GuestbookEntry, "comment_count">>;
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Comment>;
        Relationships: [
          {
            foreignKeyName: "comments_entry_id_fkey";
            columns: ["entry_id"];
            isOneToOne: false;
            referencedRelation: "guestbook_entries";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      entries_with_comment_counts: {
        Row: GuestbookEntry & { comment_count: number };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
