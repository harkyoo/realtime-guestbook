# Implementation Plan

## Objective

Build a Next.js-based real-time digital guestbook where users can submit a nickname, message, and either an uploaded photo or canvas drawing, then browse entries on a sticky-note wall and discuss them through live-updating comments.

## Delivery Approach

Use an iterative build sequence that gets the core loop working first:

1. project foundation
2. data model and Supabase integration
3. entry creation flow
4. wall browsing experience
5. detail and comments
6. realtime synchronization
7. UX polish and deployment readiness

## Phase 1: Foundation

- Initialize a Next.js app with App Router, TypeScript, and Tailwind CSS
- Establish folder structure for app routes, components, lib helpers, and types
- Add environment variable handling for Supabase
- Create shared validation schemas and constants

### Suggested initial structure

```text
.
├── AGENTS.md
├── memory-bank/
│   ├── architecture.md
│   ├── implementation-plan.md
│   └── progress.md
├── app/
│   ├── page.tsx
│   ├── wall/page.tsx
│   └── globals.css
├── components/
│   ├── guestbook/
│   ├── wall/
│   └── comments/
├── lib/
│   ├── supabase/
│   ├── validation/
│   └── utils/
├── types/
└── public/
```

## Phase 2: Supabase Setup

- Create Supabase project
- Create `guestbook_entries` and `comments` tables
- Create storage bucket for media assets
- Enable realtime for relevant tables
- Define row-level security strategy

### Initial DB tasks

- Add primary keys and timestamps
- Add foreign key from comments to guestbook entries
- Add indexes for `created_at` and `entry_id`
- Decide on public vs private storage bucket policy

## Phase 3: Entry Creation Experience

- Build a creation-first landing page
- Add nickname and message fields
- Add image upload control
- Add drawing canvas with basic tools:
  - pen
  - color selection
  - clear
- Export drawing to image on submit
- Validate that at least one visual asset exists
- Upload image blob to storage and persist entry record

## Phase 4: Sticky-Note Wall

- Build responsive wall page
- Load latest entries ordered by newest first
- Render entries as sticky-note cards with:
  - nickname
  - short message preview
  - image thumbnail
  - comment count
- Add empty state for no entries
- Add loading skeletons or pending state

## Phase 5: Detail and Comments

- Add modal or route-based detail view
- Show full-size image or drawing
- Show full message and nickname
- Query and render comments
- Add comment composer with nickname and message
- Submit comments with optimistic or near-real-time feedback

## Phase 6: Realtime Synchronization

- Subscribe wall view to new guestbook entries
- Subscribe detail view to comments for selected entry
- Merge incoming records into existing client state
- Prevent duplicate insertion when optimistic updates and realtime events overlap

## Phase 7: UI and Product Polish

- Refine sticky-note visuals and board layout
- Ensure strong mobile usability for drawing and posting
- Add error toasts or inline validation
- Add graceful loading and failure handling
- Check text overflow, thumbnail cropping, and modal ergonomics

## Technical Decisions to Prefer

- Prefer Supabase over custom WebSocket backend for faster delivery and lower operational overhead
- Prefer server-side initial fetch plus client-side realtime hydration
- Prefer storing drawings as image files rather than raw JSON stroke data for simpler rendering in the wall and detail views

## Validation Checklist

- User can create an entry with uploaded photo
- User can create an entry with canvas drawing
- Entry appears on wall without manual refresh
- User can open a sticky note and read details
- User can add a comment
- Comment appears without manual refresh
- Mobile layout remains usable on creation page and wall page

## Stretch Ideas

- Reaction badges on entries
- Randomized but bounded sticky-note rotation
- Guestbook filtering or search
- Event-specific rooms or shareable invite links
- Moderation tools or profanity filtering
- Local nickname persistence for convenience

## Documentation Rule

Before and during implementation, always consult and update:

- `AGENTS.md`
- `memory-bank/architecture.md`
- `memory-bank/progress.md`
- `memory-bank/implementation-plan.md`
