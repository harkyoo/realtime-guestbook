# Architecture

## Project Summary

This project is a real-time digital guestbook web application for events, exhibitions, and gatherings. Visitors can leave a short message together with either an uploaded photo or a drawing created on a canvas. Submitted entries appear on a second page as sticky-note style cards, and both guestbook entries and comments update in real time without requiring a page refresh.

## Product Goals

- Make contribution simple for first-time users on mobile and desktop.
- Preserve a warm, analog guestbook feeling while keeping the UI practical.
- Support image upload and in-browser drawing as equal first-class input methods.
- Reflect new entries and comments instantly across connected clients.
- Keep identity lightweight with nickname-based participation instead of required auth.

## Implemented Technical Stack

### Frontend

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI icons: `lucide-react`
- Date formatting: `date-fns` Korean relative time formatting
- Drawing UI: custom HTML Canvas pointer handling in a client component
- Data flow: server-rendered initial wall data with client-side Supabase Realtime subscriptions

### Backend and Data

- Backend platform: Supabase
- Database: Supabase Postgres
- Realtime: Supabase Realtime channels for inserted `guestbook_entries` and inserted `comments`
- Storage: public Supabase Storage bucket named `guestbook-media`
- Write orchestration: Next.js server actions validate form input, upload media, and insert database records

## Application Routes

- `/` - creation-first landing page with nickname, message, drawing canvas, and photo upload controls
- `/wall` - responsive sticky-note wall with live entry updates and an entry detail/comment modal

## Core Components

- `GuestbookForm` - mobile-friendly entry form, media mode switch, validation feedback, and submit state
- `DrawingCanvas` - simple touch/mouse canvas with color choices and clear control, exported as PNG `File`
- `StickyNoteGrid` - realtime wall container, empty/error states, selected entry modal state, and comment count updates
- `StickyNoteCard` - post-it style entry preview with thumbnail, nickname, message, time, and comment count
- `EntryDetailModal` - full media preview, message, live comment list, and comment composer
- `CommentForm` - nickname/message comment form backed by a server action

## Data Model

### `guestbook_entries`

- `id` UUID primary key
- `nickname` text not null, 1-24 characters
- `message` text not null, 1-180 characters
- `media_type` text not null, constrained to `photo` or `drawing`
- `media_path` text not null, bucket-relative Supabase Storage path
- `thumbnail_path` text nullable, reserved for future generated thumbnails
- `created_at` timestamptz default now()

### `comments`

- `id` UUID primary key
- `entry_id` UUID references `guestbook_entries(id)` on delete cascade
- `nickname` text not null, 1-24 characters
- `message` text not null, 1-160 characters
- `created_at` timestamptz default now()

### `entries_with_comment_counts`

A read view joins `guestbook_entries` to `comments` and returns each entry with `comment_count` for wall rendering.

## Media Handling Strategy

- Uploaded photos are submitted as browser `File` values.
- Canvas drawings are exported as PNG blobs and attached to a hidden file input before submission.
- Server actions upload the selected photo or drawing to the `guestbook-media` bucket under `entries/{entryId}.{extension}`.
- Database rows store bucket-relative paths, and UI helpers derive public Supabase Storage URLs at render time.
- The current implementation stores original media only; `thumbnail_path` is present for later image optimization workflows.

## Realtime Strategy

- `/wall` initially queries `entries_with_comment_counts` on the server.
- `StickyNoteGrid` subscribes to `INSERT` events on `public.guestbook_entries` and prepends new entries locally.
- `EntryDetailModal` fetches comments for the selected entry, then subscribes to filtered `INSERT` events for that entry's comments.
- Incoming realtime rows are de-duplicated before being merged into local state.
- Comment inserts also increment the selected entry and wall card comment counts in the active client.

## UX Principles

- Creation flow is the first screen with direct access to the wall.
- Drawing controls are minimal: color and clear.
- Sticky notes use bounded rotations, soft colors, and a cork-board texture for a warm analog feel without harming readability.
- Loading, empty, error, and missing-environment states are explicit.
- Forms use large rounded controls for mobile event-floor usage.

## Deployment Assumptions

- Frontend deployed on Vercel or equivalent Next.js hosting.
- Supabase project provides Postgres, Storage, and Realtime.
- Required environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET` (defaults to `guestbook-media`)
- Run `supabase/schema.sql` in Supabase and enable Realtime for `guestbook_entries` and `comments`.

## Open Decisions / Future Architecture Options

- Add image resizing or generated thumbnails for large event traffic.
- Add event-specific rooms so several guestbooks can share one deployment.
- Add moderation, spam throttling, or optional admin authentication.
- Add reaction badges separate from comments.
