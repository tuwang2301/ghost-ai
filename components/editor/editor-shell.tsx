"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { WorkspaceProvider } from "@/components/editor/workspace-context"
import { ProjectActionsProvider } from "@/hooks/use-project-actions"
import { Project } from "@/types/project"

interface EditorShellProps {
  children: React.ReactNode
  ownedProjects?: Project[]
  sharedProjects?: Project[]
}

export function EditorShell({
  children,
  ownedProjects = [],
  sharedProjects = [],
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ProjectActionsProvider
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      <WorkspaceProvider>
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex h-screen flex-1 flex-col pt-14 overflow-hidden">{children}</main>
        <ProjectDialogs />
      </WorkspaceProvider>
    </ProjectActionsProvider>
  )
}
