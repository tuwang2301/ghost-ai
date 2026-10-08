"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export function CreateProjectDialog() {
  const {
    activeDialog,
    closeDialog,
    projectName,
    setProjectName,
    slugPreview,
    createProject,
    isLoading,
    formError,
  } = useProjectDialogs()

  const isOpen = activeDialog === "create"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createProject()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog() }}>
      <DialogContent className="rounded-3xl border border-surface-border bg-surface sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-copy-primary">
              Create Project
            </DialogTitle>
            <DialogDescription className="text-sm text-copy-muted">
              Start a new architecture workspace. Choose a name to begin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="create-project-name"
              className="text-xs font-medium uppercase tracking-wider text-copy-muted"
            >
              Project Name
            </label>
            <Input
              id="create-project-name"
              autoFocus
              placeholder="e.g. Analytics Pipeline"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="border-surface-border bg-subtle text-copy-primary"
            />
            {formError && (
              <p className="text-xs text-state-error">{formError}</p>
            )}
            <div className="flex items-center gap-2 pt-1 text-xs text-copy-muted font-mono">
              <span className="text-copy-faint">Slug preview:</span>
              <span className="text-copy-primary">
                {slugPreview ? `/editor/${slugPreview}` : "/editor/..."}
              </span>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || isLoading}
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RenameProjectDialog() {
  const {
    activeDialog,
    closeDialog,
    targetProject,
    projectName,
    setProjectName,
    renameProject,
    isLoading,
    formError,
  } = useProjectDialogs()

  const isOpen = activeDialog === "rename"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    renameProject()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (e.nativeEvent.isComposing) {
        return
      }
      e.preventDefault()
      renameProject()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog() }}>
      <DialogContent className="rounded-3xl border border-surface-border bg-surface sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-copy-primary">
              Rename Project
            </DialogTitle>
            <DialogDescription className="text-sm text-copy-muted">
              Current project name:{" "}
              <span className="font-medium text-copy-primary">
                {targetProject?.name}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="rename-project-name"
              className="text-xs font-medium uppercase tracking-wider text-copy-muted"
            >
              New Name
            </label>
            <Input
              id="rename-project-name"
              autoFocus
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-surface-border bg-subtle text-copy-primary"
            />
            {formError && (
              <p className="text-xs text-state-error">{formError}</p>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || isLoading}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function DeleteProjectDialog() {
  const {
    activeDialog,
    closeDialog,
    targetProject,
    deleteProject,
    isLoading,
  } = useProjectDialogs()

  const isOpen = activeDialog === "delete"

  const handleDelete = () => {
    deleteProject()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) closeDialog() }}>
      <DialogContent className="rounded-3xl border border-surface-border bg-surface sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-copy-primary">
            Delete Project
          </DialogTitle>
          <DialogDescription className="text-sm text-copy-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-copy-primary">
              &quot;{targetProject?.name}&quot;
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ProjectDialogs() {
  return (
    <>
      <CreateProjectDialog />
      <RenameProjectDialog />
      <DeleteProjectDialog />
    </>
  )
}
