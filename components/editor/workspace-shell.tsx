"use client"

import * as React from "react"
import { Bot, LayoutGrid, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWorkspace } from "@/components/editor/workspace-context"
import { ShareDialog } from "@/components/editor/share-dialog"

interface WorkspaceShellProps {
  project: {
    id: string
    name: string
    description?: string | null
  }
}

export function WorkspaceShell({ project }: WorkspaceShellProps) {
  const workspace = useWorkspace()

  React.useEffect(() => {
    workspace?.setProjectName(project.name)
    return () => {
      workspace?.setProjectName(null)
    }
  }, [project.name, workspace])

  const isAiOpen = workspace?.isAiOpen ?? false
  const toggleAi = workspace?.toggleAi
  const isShareOpen = workspace?.isShareOpen ?? false
  const closeShare = workspace?.closeShare ?? (() => {})

  return (
    <>
      <div className="flex h-full w-full flex-1 overflow-hidden">
        {/* Central Canvas Placeholder */}
        <div className="relative flex flex-1 flex-col items-center justify-center bg-base p-6 text-center select-none overflow-hidden">
          {/* Subtle technical canvas background dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(var(--border-subtle)_1px,transparent_1px)] [background-size:24px_24px]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-md space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-surface text-brand shadow-sm">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-copy-primary">
              Canvas Workspace
            </h2>
            <p className="text-sm text-copy-muted">
              Collaborative architecture canvas placeholder. React Flow and Liveblocks collaboration will be wired here.
            </p>
            <div className="inline-flex items-center rounded-full border border-surface-border bg-surface/80 px-3 py-1 text-xs font-mono text-copy-muted">
              Room: {project.id}
            </div>
          </div>
        </div>

        {/* Right Sidebar Placeholder for future AI chat */}
        {isAiOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-surface-border bg-surface/95 backdrop-blur-sm transition-all duration-200">
            <div className="flex h-12 items-center justify-between border-b border-surface-border px-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ai-text" />
                <span className="text-sm font-semibold text-copy-primary">AI Assistant</span>
              </div>
              {toggleAi && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={toggleAi}
                  aria-label="Close AI panel"
                  className="text-copy-muted hover:text-copy-primary"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-subtle text-ai-text mb-3">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-copy-primary">AI Architecture Assistant</h3>
              <p className="mt-1 text-xs text-copy-muted max-w-[200px]">
                Generate and iterate system designs from natural language prompts. Coming soon.
              </p>
            </div>
          </aside>
        )}
      </div>

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={closeShare}
        projectId={project.id}
        projectName={project.name}
      />
    </>
  )
}
