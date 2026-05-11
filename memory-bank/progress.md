# Progress

## Current Status

Initial Next.js/Supabase implementation is in place and has been verified against a live Supabase project. The app includes a creation page, sticky-note wall, detail modal, comments, realtime subscriptions, Supabase schema, environment documentation, and warm responsive styling. Local dependencies are installed, the local environment is configured, the schema is applied, and the local app is running successfully.

## Completed

- Captured the product brief for the real-time guestbook experience
- Defined the memory-bank documentation structure
- Added repository-level guidance in `AGENTS.md`
- Drafted and updated architecture direction
- Drafted and updated implementation roadmap
- Scaffolded a Next.js App Router project with TypeScript and Tailwind CSS
- Added Supabase client/server helpers and environment variable handling
- Added shared TypeScript data types and validation schemas
- Implemented entry creation with nickname, message, photo upload, and canvas drawing export
- Implemented server actions for media upload, entry insert, and comment insert
- Implemented responsive sticky-note wall UI
- Implemented entry detail modal with full media preview and comments
- Added Supabase Realtime subscriptions for new entries and entry-specific comments
- Added SQL schema, RLS policies, storage bucket setup, indexes, and comment-count view
- Added README and `.env.example`
- Started the local Next.js dev server successfully
- Verified the local app responds on `http://localhost:3000`
- Verified `.env.local` now contains non-placeholder Supabase values
- Normalized the Supabase URL in `.env.local` to the project base URL format
- Verified `supabase/schema.sql` is applied in the connected Supabase project
- Verified the wall reads live data from Supabase successfully
- Verified the application runs locally with the configured Supabase backend
- Verified `npm run typecheck`, `npm run lint`, and `npm run build` all succeed locally

## In Progress

- Preparing final repository updates for push

## Not Started

- Actual Supabase project provisioning outside the repository
- Production deployment configuration in Vercel or another host
- Image thumbnail generation / optimization pipeline
- Moderation and spam controls
- Event room/multi-board support

## Risks / Watchpoints

- Supabase Realtime must be enabled for `public.guestbook_entries` and `public.comments` in the Supabase project dashboard.
- Public anonymous insert policies are intentionally simple for event usage but should be revisited before open internet deployments.
- Canvas export and upload flow needs device testing on real iOS/Android browsers.
- The current environment does not have the `supabase` CLI installed, so dashboard-side setup cannot be automated from this shell alone.
- Test data inserted during verification cannot be deleted through the public anon key because the schema intentionally does not grant `DELETE` privileges to anonymous clients.

## Next Recommended Milestones

1. Remove verification-only guestbook records through the Supabase dashboard or SQL editor if a clean demo dataset is desired.
2. Decide whether anonymous deletion should stay disallowed in production.
3. Deploy to Vercel and configure production environment variables.
4. Add image optimization, moderation, or multi-room support as follow-up product work.

## Notes for Future Updates

Update this file whenever:

- a milestone starts or completes
- architecture decisions materially change scope
- new blockers or risks appear
- verification steps reveal gaps
