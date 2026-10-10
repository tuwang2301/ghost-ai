"use client"

import { PanelLeftClose, PanelLeftOpen, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useProjectActions } from "@/hooks/use-project-actions"
import { useWorkspace } from "@/components/editor/workspace-context"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen
  const pathname = usePathname()
  const { projects } = useProjectActions()
  const workspace = useWorkspace()

  const isWorkspaceRoute = pathname.startsWith("/editor/") && pathname !== "/editor"
  const currentRoomId = isWorkspaceRoute ? pathname.slice("/editor/".length) : null
  const matchedProject = currentRoomId ? projects.find((p) => p.id === currentRoomId) : null
  const projectName = workspace?.projectName || matchedProject?.name || null

  const isAiOpen = workspace?.isAiOpen ?? false
  const toggleAi = workspace?.toggleAi
  const openShare = workspace?.openShare

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-surface-border bg-surface px-3">
      {/* Left section: sidebar toggle and project name */}
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
        >
          <SidebarIcon />
        </Button>

        {isWorkspaceRoute && projectName && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="h-4 w-px bg-surface-border" aria-hidden="true" />
            <h1 className="truncate text-sm font-medium text-copy-primary">
              {projectName}
            </h1>
          </div>
        )}
      </div>

      {/* Right section: actions and user profile */}
      <div className="flex items-center gap-2">
        {isWorkspaceRoute && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={openShare}
              className="h-8 gap-1.5 px-2.5 text-xs text-copy-primary hover:bg-subtle"
              aria-label="Share project"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>

            <Button
              aria-label={isAiOpen ? "Close AI chat" : "Open AI chat"}
              variant={isAiOpen ? "secondary" : "ghost"}
              size="sm"
              onClick={toggleAi}
              className={`h-8 gap-1.5 px-2.5 text-xs transition-colors ${
                isAiOpen
                  ? "bg-accent-dim text-ai-text border border-accent-ai/20"
                  : "text-copy-primary hover:bg-subtle"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-ai-text" />
              <span className="hidden sm:inline">AI</span>
            </Button>
          </div>
        )}

        <div className="ml-1 flex items-center">
          <UserButton />
        </div>
      </div>
    </nav>
  )
}
