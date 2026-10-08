# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Complete: Project Dialogs & Editor Home (`context/feature-specs/04-project-dialogs.md`)

## Current Goal

- Ready for next feature spec (e.g. Project persistence or collaborative canvas).

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

## In Progress

- None.

## Next Up

- Implement project persistence or collaborative canvas depending on the next feature specification.

## Open Questions

- None at this time.

## Architecture Decisions

- Use the default shadcn/ui component structure under `components/ui` with the shared `lib/utils.ts` entry point.
- Keep generated UI primitives untouched and apply the Ghost AI dark-theme tokens at the app-level stylesheet.

## Session Notes

- This unit is scoped to the reusable editor frame described in `context/feature-specs/02-editor-chrome.md`. The generated shadcn components remain default and reusable.
