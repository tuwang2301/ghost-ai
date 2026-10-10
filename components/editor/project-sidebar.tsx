"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Folder, Pencil, Plus, Trash2, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useProjectActions } from "@/hooks/use-project-actions"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function EmptyProjectsState({ message = "No projects yet" }: { message?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border p-6 text-center text-sm text-copy-muted">
      {message}
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const pathname = usePathname()
  const {
    projects,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
  } = useProjectActions()
  const sidebarRef = React.useRef<HTMLElement>(null)

  const myProjects = React.useMemo(
    () => projects.filter((p) => p.isOwner),
    [projects]
  )
  const sharedProjects = React.useMemo(
    () => projects.filter((p) => !p.isOwner),
    [projects]
  )

  React.useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        if (window.innerWidth < 768) {
          onClose()
        }
      }
    }

    window.addEventListener("pointerdown", handlePointerDown)
    return () => window.removeEventListener("pointerdown", handlePointerDown)
  }, [isOpen, onClose])

  const handleProjectClick = () => {
    if (window.innerWidth < 768) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile backdrop scrim */}
      {isOpen && (
        <div
          data-slot="sidebar-backdrop"
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        ref={sidebarRef}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-4 left-4 top-16 z-30 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur-sm transition-transform duration-200 ${isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
          }`}
      >
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-copy-primary">Projects</h2>
          <Button
            aria-label="Close projects sidebar"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="mt-4 flex min-h-0 flex-1 flex-col">
          <TabsList className="grid h-9 w-full shrink-0 grid-cols-2 border border-surface-border bg-subtle">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="mt-4 flex min-h-0 flex-1 flex-col">
            {myProjects.length === 0 ? (
              <EmptyProjectsState message="No projects yet" />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1 pr-2">
                  {myProjects.map((project) => {
                    const isActive = pathname === `/editor/${project.id}`
                    return (
                      <div
                        key={project.id}
                        className={`group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition-colors ${
                          isActive
                            ? "bg-accent-dim text-brand border border-accent-primary/20"
                            : "hover:bg-subtle"
                        }`}
                      >
                        <Link
                          href={`/editor/${project.id}`}
                          onClick={handleProjectClick}
                          className="flex min-w-0 flex-1 items-center gap-2.5 focus:outline-none"
                        >
                          <Folder
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-brand" : "text-copy-muted group-hover:text-brand"
                            }`}
                          />
                          <div className="flex min-w-0 flex-col text-left">
                            <span
                              className={`truncate text-sm font-medium ${
                                isActive ? "text-brand" : "text-copy-primary"
                              }`}
                            >
                              {project.name}
                            </span>
                            {project.updatedAt && (
                              <span className="text-[11px] text-copy-muted">
                                {project.updatedAt}
                              </span>
                            )}
                          </div>
                        </Link>
                        <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openRenameDialog(project)}
                            aria-label={`Rename ${project.name}`}
                            className="text-copy-muted hover:text-copy-primary"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => openDeleteDialog(project)}
                            aria-label={`Delete ${project.name}`}
                            className="text-copy-muted hover:text-state-error"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-4 flex min-h-0 flex-1 flex-col">
            {sharedProjects.length === 0 ? (
              <EmptyProjectsState message="No shared projects" />
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-1 pr-2">
                  {sharedProjects.map((project) => {
                    const isActive = pathname === `/editor/${project.id}`
                    return (
                      <div
                        key={project.id}
                        className={`group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 transition-colors ${
                          isActive
                            ? "bg-accent-dim text-brand border border-accent-primary/20"
                            : "hover:bg-subtle"
                        }`}
                      >
                        <Link
                          href={`/editor/${project.id}`}
                          onClick={handleProjectClick}
                          className="flex min-w-0 flex-1 items-center gap-2.5 focus:outline-none"
                        >
                          <Users
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-brand" : "text-copy-muted group-hover:text-ai-text"
                            }`}
                          />
                          <div className="flex min-w-0 flex-col text-left">
                            <span
                              className={`truncate text-sm font-medium ${
                                isActive ? "text-brand" : "text-copy-primary"
                              }`}
                            >
                              {project.name}
                            </span>
                            {project.updatedAt && (
                              <span className="text-[11px] text-copy-muted">
                                {project.updatedAt}
                              </span>
                            )}
                          </div>
                        </Link>
                        {/* Shared/collaborator projects have actions hidden */}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        <Button
          className="mt-4 w-full shrink-0"
          variant="outline"
          onClick={openCreateDialog}
        >
          <Plus />
          New Project
        </Button>
      </aside>
    </>
  )
}
