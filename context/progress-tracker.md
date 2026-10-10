# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Complete: Share Dialog (`context/feature-specs/09-share-dialog.md`)

## Current Goal

- Ready for next feature spec (e.g. Collaborative Canvas / Liveblocks integration).

## Completed

- Reviewed the product, architecture, UI, standards, and feature-spec context for the design-system work.
- Initialized shadcn/ui in the project and installed the required primitives: Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea.
- Installed `lucide-react` and confirmed the default dark theme is applied through the project-level CSS variables.
- Added the shared utility entry point in `lib/utils.ts` and validated the app builds cleanly with the component library in place.
- Fixed the dialog trigger composition so the generated `Button` is rendered as the trigger element rather than nested inside another button.
- Added the reusable `EditorNavbar` with sidebar state icons and a fixed dark top bar.
- Added the floating `ProjectSidebar` with slide-in behavior, project tabs, empty states, close control, and bottom `New Project` action.
- Kept dialog behavior deferred while preserving the existing token-backed shadcn dialog pattern for future use.
- Validated the editor chrome with ESLint, TypeScript, the production build, and editor diagnostics.
- Added the client-side `EditorShell` and composed the navbar and project sidebar into the root layout without pushing canvas content.
- Installed `@clerk/ui` dependency.
- Wrapped root layout with `ClerkProvider` using Clerk's `dark` theme from `@clerk/ui/themes` with CSS variable overrides for dark theme tokens.
- Created `proxy.ts` at the project root using `clerkMiddleware` to protect all routes by default while allowing public auth routes based on sign-in and sign-up env vars.
- Implemented minimal two-panel `AuthLayout` and created sign-in (`/sign-in/[[...sign-in]]`) and sign-up (`/sign-up/[[...sign-up]]`) pages with responsive left-panel brand details and centered Clerk forms with zero gradients, no oversized hero sections, and strict CSS variable styling.
- Created `/editor` route for the workspace inside `EditorLayout` protected by server-side auth check.
- Updated root `/` route to redirect authenticated users to `/editor` and unauthenticated users to `/sign-in`.
- Added Clerk's built-in `UserButton` to the right section of `EditorNavbar`.
- Fixed the projects sidebar to default to closed (`isSidebarOpen: false`) in `EditorShell`.
- Fixed `@base-ui/react` orientation selector mismatch in `Tabs` (`components/ui/tabs.tsx`) and polished the sidebar flexbox layout (`components/editor/project-sidebar.tsx`) so the tab bar maintains a compact height (`h-9`) and content area expands cleanly.
- Implemented `/editor` home screen with minimal cardless layout, exact heading ("Create a project or open an existing one"), description ("Start a new architecture workspace, or choose a project from the sidebar."), and `New Project` button with `Plus` icon.
- Created dedicated hook `useProjectDialogs` and `ProjectDialogsProvider` in `hooks/use-project-dialogs.tsx` managing dialog state (`create`, `rename`, `delete`), form state (name, live slug preview, errors), loading state, and mock project modifications.
- Implemented `CreateProjectDialog` with project name input and live slug preview updating on every keystroke.
- Implemented `RenameProjectDialog` with prefilled project name input, current project name in description, auto-focus, and Enter-key submission.
- Implemented `DeleteProjectDialog` with destructive confirmation only, no inputs, and destructive button styling.
- Updated `ProjectSidebar` to display mock projects under "My Projects" and "Shared" tabs, with rename and delete actions for owned projects, actions hidden for shared projects, empty state fallbacks, and mobile backdrop scrim with tap-outside dismiss.
- Wired all dialog triggers (`EditorHome` New Project, `ProjectSidebar` New Project, Rename, and Delete actions) to the dedicated hook.
- Validated with TypeScript, ESLint (`npm run lint`), and Next.js 16 production build (`npm run build`).
- Resolved code review issues from `context/feature-specs/current-issues.md`:
  - Updated `RenameProjectDialog` to avoid triggering submission when Enter is pressed while IME composition (`e.nativeEvent.isComposing`) is active.
  - Converted `signInPath` and `signUpPath` configurations in `proxy.ts` to normalized pathnames for full URLs while keeping default fallbacks.
  - Refined public route check in `proxy.ts` to strictly match exact and child authentication paths rather than arbitrary prefix matches.
  - Made slug handling consistent across create, rename, and preview in `useProjectDialogs` by rejecting names producing empty slugs, ensuring preview matches saved slug.
  - Added `inert={!isOpen}` to `ProjectSidebar` so elements are removed from keyboard navigation/tab order when closed while remaining accessible when open.
- Created `prisma/models/project.prisma` containing `ProjectStatus` enum (`DRAFT`, `ARCHIVED`), `Project` model (owner ID mapped to Clerk user, name, optional description, status enum with DRAFT default, optional canvasJsonPath, timestamps, and indexes on owner ID and creation date), and `ProjectCollaborator` model (project relation with cascade delete, collaborator email, creation timestamp, unique constraint on project/email, and indexes on email and project/date).
- Created `lib/prisma.ts` as a cached singleton branching between Accelerate (`prisma+postgres://`) and direct `@prisma/adapter-pg` based on `DATABASE_URL`, caching the instance on `globalThis` in development.
- Successfully ran initial migration `20261008104343_init` creating PostgreSQL tables, foreign keys with cascade delete, indexes, and enums against the database.
- Generated Prisma Client to `app/generated/prisma`.
- Verified live database operations (create, query, cascade delete) via Prisma Client.
- Created `lib/auth.ts` providing `getAuthUserId()` helper to extract Clerk authenticated user ID with support for test mocking.
- Updated `proxy.ts` so unauthenticated `/api/*` requests return JSON `401 Unauthorized` instead of redirecting to the sign-in page.
- Implemented `GET /api/projects` in `app/api/projects/route.ts` to list current user's owned projects ordered by creation date descending, including collaborators.
- Implemented `POST /api/projects` in `app/api/projects/route.ts` to create projects with authenticated `ownerId`, defaulting missing/empty name to "Untitled Project", and utilizing Prisma's schema cuid strategy.
- Implemented `PATCH /api/projects/[projectId]` in `app/api/projects/[projectId]/route.ts` with Next.js 16 async route params, 401 unauthenticated check, 404 project existence check, 403 owner authorization enforcement, and name validation.
- Implemented `DELETE /api/projects/[projectId]` in `app/api/projects/[projectId]/route.ts` with 401 unauthenticated check, 404 project existence check, 403 owner authorization enforcement, and database cascade deletion.
- Verified all endpoints end-to-end with unit test suite covering 401s, 403s, 404s, creation defaults, cuid generation, owner rename, and owner delete.
- Created server-side project data helper in `lib/projects.ts` using React `cache` and Prisma to query owned and shared projects, formatted with relative time via `lib/date.ts`.
- Server-side data fetching wired into `EditorLayout` (`app/editor/layout.tsx`) and `EditorPage` (`app/editor/page.tsx`), passing owned and shared projects down with no client-side fetching on initial load.
- Created `useProjectActions` hook and `ProjectActionsProvider` in `hooks/use-project-actions.tsx` managing dialog state, live room ID previews with unique short suffix generation, and project mutations.
- Updated `POST /api/projects` to accept custom room/project ID while defaulting to schema cuid when omitted, keeping the project ID and Liveblocks room ID aligned.
- Wired create mutation to call `POST /api/projects` and navigate directly to `/editor/[projectId]` workspace.
- Wired rename mutation to call `PATCH /api/projects/[id]` and trigger `router.refresh()`.
- Wired delete mutation to call `DELETE /api/projects/[id]`, redirecting to `/editor` if deleting the active workspace, or triggering `router.refresh()`.
- Replaced legacy `app/editor/[projectId]` route with `/editor/[roomId]` server component according to spec.
- Created `lib/project-access.ts` access helpers to extract Clerk identity (`userId` + primary email) and verify project access by owner or collaborator.
- Created `components/editor/access-denied.tsx` with centered layout, lock icon, description, and link back to `/editor`.
- Implemented `/editor/[roomId]` server component (`app/editor/[roomId]/page.tsx`) with `auth.protect()` redirect and `AccessDenied` view for unauthorized or non-existent projects.
- Created `components/editor/workspace-context.tsx` and updated `EditorShell` with `WorkspaceProvider` and full-viewport layout (`h-screen overflow-hidden`).
- Updated `components/editor/editor-navbar.tsx` to display project name when in workspace, along with Share button and AI sidebar toggle.
- Updated `components/editor/project-sidebar.tsx` with `usePathname()` to highlight active room in both My Projects and Shared tabs.
- Created `components/editor/workspace-shell.tsx` with dark central canvas placeholder, technical dot grid, centered message, and toggleable right AI sidebar placeholder.
- Created `lib/clerk-users.ts` utility using Clerk Backend API (`clerkClient().users.getUserList`) to enrich collaborator emails with display names and avatar images with fallback to email.
- Created `GET/POST /api/projects/[projectId]/collaborators` API endpoints: listing enriched collaborators (accessible by owner and collaborators) and inviting collaborators by email (owner-only mutation enforcement).
- Created `DELETE /api/projects/[projectId]/collaborators/[collaboratorId]` API endpoint with server-side owner-only deletion enforcement.
- Created `components/editor/share-dialog.tsx` featuring copy link feedback, owner invite form, collaborator list with Clerk avatar badges, and owner-only remove actions.
- Connected `Share` button in `EditorNavbar` to open `ShareDialog` in the active workspace.
- Validated with Next.js 16 build (`npm run build`), TypeScript (`npx tsc --noEmit`), and ESLint (`npm run lint`).

## In Progress

- None.

## Next Up

- Ready for next feature spec (e.g. Collaborative Canvas / Liveblocks integration).

## Open Questions

- None at this time.

## Architecture Decisions

- Use the default shadcn/ui component structure under `components/ui` with the shared `lib/utils.ts` entry point.
- Keep generated UI primitives untouched and apply the Ghost AI dark-theme tokens at the app-level stylesheet.

## Session Notes

- This unit is scoped to the reusable editor frame described in `context/feature-specs/02-editor-chrome.md`. The generated shadcn components remain default and reusable.
