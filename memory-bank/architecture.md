# Architecture

## Project Summary

This project is a real-time digital guestbook web application for events, exhibitions, and gatherings. Visitors can leave a short message together with either an uploaded photo or a drawing created on a canvas. Submitted entries appear on a second page as sticky-note style cards, and both guestbook entries and comments update in real time without requiring a page refresh.

## Product Goals

- Make contribution simple for first-time users on mobile and desktop.
- Preserve a warm, analog guestbook feeling while keeping the UI practical.
- Support image upload and in-browser drawing as equal first-class input methods.
- Reflect new entries and comments instantly across connected clients.
- Keep identity lightweight with nickname-based participation instead of required auth.

## Recommended Technical Direction

### Frontend

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- State/data layer: React Server Components for initial loads, client components for interactions, Supabase client subscriptions for live updates
- Drawing UI: HTML Canvas with a lightweight drawing wrapper or custom pointer handling

### Backend and Data

- Backend platform: Supabase
- Database: Postgres
- Realtime: Supabase Realtime channels for `guestbook_entries` and `comments`
- Storage: Supabase Storage bucket for uploaded photos and exported canvas images
- API surface: Next.js server actions or route handlers for validation and write orchestration

## High-Level User Flow

### Page 1: Entry Creation

Users land on a creation-first screen where they can:

- Enter a nickname
- Enter a short message
- Upload a photo
- Or draw directly on a canvas
- Submit once at least one visual asset exists

Validation rules:

- Nickname required
- Message required, with a reasonable max length
- At least one of uploaded photo or drawing required

### Page 2: Guestbook Wall

Users browse a responsive wall of sticky-note style cards that display:

- Nickname
- Short message
- Thumbnail of uploaded image or drawing
- Relative creation time
- Comment count

The wall should feel playful and tactile, but maintain a stable and readable layout.

### Entry Detail / Modal

Clicking a sticky note opens a detail modal or dedicated route showing:

- Full-size image or drawing
- Full message
- Author nickname
- Comment thread
- Comment composer

New comments should appear in place without reload.

## Proposed Application Structure

### Routes

- `/` - guestbook entry creation page
- `/wall` - sticky-note guestbook board
- optional `/(wall)/entries/[id]` - dedicated detail route if modal routing is adopted

### Core UI Components

- `GuestbookForm`
- `ImageUploadField`
- `DrawingCanvas`
- `StickyNoteGrid`
- `StickyNoteCard`
- `EntryDetailModal`
- `CommentList`
- `CommentForm`

### Shared Logic

- input validation schema for entries and comments
- storage upload helper for image and drawing assets
- realtime subscription hooks for entries and comments
- query helpers to normalize entry + comment payloads

## Data Model Draft

### `guestbook_entries`

- `id` UUID primary key
- `nickname` text not null
- `message` text not null
- `media_type` text not null
  - expected values: `photo`, `drawing`
- `media_path` text not null
- `thumbnail_path` text nullable
- `created_at` timestamptz default now()

### `comments`

- `id` UUID primary key
- `entry_id` UUID references `guestbook_entries(id)` on delete cascade
- `nickname` text not null
- `message` text not null
- `created_at` timestamptz default now()

## Media Handling Strategy

- Uploaded photos are stored directly in Supabase Storage.
- Canvas drawings are exported as image blobs on submit, then uploaded to the same bucket.
- Store bucket-relative paths in the database instead of full public URLs.
- Generate public or signed URLs in the app layer depending on bucket privacy choice.

## Realtime Strategy

- Initial wall and detail data load from server-side queries.
- Client components subscribe to Supabase Realtime events for:
  - inserted guestbook entries
  - inserted comments
- New events merge into local UI state without reload.
- For detail views, subscribe only to the selected entry's comments to reduce noise.

## UX Principles

- Creation flow should be the first thing users can do, without extra navigation overhead.
- Drawing controls should be minimal: pen, color, clear, save-ready preview.
- Sticky notes should look warm and human, but not chaotic.
- Empty, loading, and error states should be explicit and calm.

## Deployment Assumptions

- Frontend deployed on Vercel or equivalent Next.js hosting
- Supabase project provides database, storage, and realtime
- Environment variables stored in deployment platform settings

## Open Decisions

- Whether entry detail is modal-only or route-based modal
- Whether to support both uploaded photo and drawing on one entry, or exactly one media asset
- Whether comments remain fully anonymous or also require nickname validation persistence in local storage
