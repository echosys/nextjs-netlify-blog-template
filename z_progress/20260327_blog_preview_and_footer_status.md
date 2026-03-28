# Progress Log - 2026-03-27

## Changes Summary
- Added a **Blog Post Preview** feature that allows users to view full post content in a modern modal without page navigation.
- Implemented **Keyboard Navigation** for the preview (Left/Right arrows to switch posts, Escape to close).
- Added an **Edit Post** button within the preview pane for quick access to the editor.
- Updated the **Footer** to include live database status for both MongoDB and PostgreSQL, including partial hostnames for environment identification.
- Resolved a build error by ensuring `lucide-react` is correctly installed.

## Technical Details
- Created `PostPreview.tsx` as a shared client component for the modal UI and keyboard listeners.
- Extracted post listing logic into `MongoPostList.tsx` and `PgPostList.tsx` (Client Components) to handle the click-to-preview interaction.
- Modified `RootLayout` in `layout.tsx` to display connection details derived from environment variables.
- Verified that file attachments are correctly handled in the preview pane for both backends.

## Assumptions & Notes
- Assumed that the project uses standard relative paths for component imports as `@/` was not configured in `tsconfig.json`.
- The database status in the footer assumes that `MONGODB_URI` and `POSTGRES_URL` follow standard URI formats (splitting by `@` to find the host).
