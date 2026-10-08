"use client"

import { Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

function EmptyProjectsState() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border px-6 text-center text-sm text-copy-muted">
      No projects yet
    </div>
  )
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      aria-hidden={!isOpen}
      className={`fixed inset-y-4 left-4 top-16 z-30 flex w-80 flex-col rounded-2xl border border-surface-border bg-surface/95 p-4 shadow-2xl backdrop-blur-sm transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
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
          <EmptyProjectsState />
        </TabsContent>
        <TabsContent value="shared" className="mt-4 flex min-h-0 flex-1 flex-col">
          <EmptyProjectsState />
        </TabsContent>
      </Tabs>

      <Button className="mt-4 w-full shrink-0" variant="outline">
        <Plus />
        New Project
      </Button>
    </aside>
  )
}
