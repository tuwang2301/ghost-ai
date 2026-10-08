"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export function EditorHome() {
  const { openCreateDialog } = useProjectDialogs()

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-copy-primary sm:text-3xl">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted sm:text-base">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <div className="pt-4">
          <Button
            onClick={openCreateDialog}
            className="gap-2 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
    </div>
  )
}
