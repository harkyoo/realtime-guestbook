# Implementation Plan

## Objective

Build a Next.js-based real-time digital guestbook where users can submit a nickname, message, and either an uploaded photo or canvas drawing, then browse entries on a sticky-note wall and discuss them through live-updating comments.

## Delivery Approach

The first implementation pass has produced a complete deployable scaffold with Supabase as the backend. Remaining work focuses on environment-backed verification, deployment, and production hardening.

## Implemented Folder Structure

```text
.
├── app/
│   ├── actions.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── wall/page.tsx
├── components/
│   ├── comments/CommentForm.tsx
│   ├── guestbook/DrawingCanvas.tsx
│   ├── guestbook/GuestbookForm.tsx
│   └── wall/
│       ├── EntryDetailModal.tsx
│       ├── StickyNoteCard.tsx
│       └── StickyNoteGrid.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── config.ts
│   │   ├── media.ts
│   │   └── server.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── date.ts
│   └── validation/guestbook.ts
├── supabase/schema.sql
├── types/database.ts
├── memory-bank/
└── README.md
```

## Phase 1: Foundation — Completed

- Initialized a Next.js App Router project structure with TypeScript and Tailwind CSS.
- Added scripts for development, build, lint, and type checking.
- Added README and `.env.example`.
- Added reusable types, validation constants, and utility helpers.

## Phase 2: Supabase Setup — Repository Artifacts Completed

- Added `supabase/schema.sql` with:
  - `guestbook_entries` table
  - `comments` table
  - indexes
  - `entries_with_comment_counts` view
  - RLS read/insert policies
  - public `guestbook-media` storage bucket and policies
- Added Supabase browser and server client helpers.

### External Setup Still Required

- Create a real Supabase project.
- Apply `supabase/schema.sql`.
- Enable Realtime for `guestbook_entries` and `comments`.
- Configure local and production environment variables.

## Phase 3: Entry Creation Experience — Completed

- Built a creation-first landing page.
- Added nickname and message fields.
- Added photo upload field with type/size validation in the server action.
- Added custom drawing canvas with color choices, touch input, and clear control.
- Exported drawings as PNG files for the same storage path as uploaded images.
- Enforced the photo-or-drawing requirement.

## Phase 4: Sticky-Note Wall — Completed

- Built a responsive cork-board wall page.
- Loaded latest entries ordered newest first through `entries_with_comment_counts`.
- Rendered entries as colorful sticky-note cards with bounded rotations.
- Added empty, missing-environment, and realtime-error states.

## Phase 5: Detail and Comments — Completed

- Added a modal detail view for clicked sticky notes.
- Displayed original media, author, message, relative time, and comments.
- Added nickname-based comment composer.
- Added server action for comment validation and insert.

## Phase 6: Realtime Synchronization — Completed

- Subscribed the wall to inserted guestbook entries.
- Subscribed the detail modal to inserted comments filtered by selected entry.
- Added duplicate protection when merging realtime rows.
- Updated local comment counts when comments arrive in the active detail modal.

## Phase 7: UI and Product Polish — Initial Pass Completed

- Added warm paper, blush, and cork textures.
- Used large rounded controls for mobile ergonomics.
- Added loading, error, empty, and success feedback states.
- Added direct navigation between creation and wall pages.

## Verification Plan

Run these after dependency installation succeeds:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. Manual browser test with two sessions:
   - submit a photo entry
   - submit a drawing entry
   - verify both appear on `/wall` without refresh
   - open a detail modal and add comments
   - verify comments appear in the other browser without refresh

## Extension Ideas

- Reaction badges on entries.
- Randomized but bounded sticky-note rotations seeded by entry ID.
- Guestbook filtering or search.
- Event-specific rooms or shareable invite links.
- Moderation queue, profanity filtering, or admin dashboard.
- Local nickname persistence for convenience.
- Server-side image resizing and thumbnail generation.
