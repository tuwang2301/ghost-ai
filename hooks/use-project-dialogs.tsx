"use client"

import * as React from "react"
import { INITIAL_MOCK_PROJECTS } from "@/lib/mock-projects"
import { generateSlug } from "@/lib/slug"
import { DialogType, Project } from "@/types/project"

export interface ProjectDialogsContextValue {
  // Dialog state
  activeDialog: DialogType
  isOpen: boolean
  targetProject: Project | null
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  closeDialog: () => void

  // Form state
  projectName: string
  setProjectName: (name: string) => void
  slugPreview: string
  formError: string | null
  setFormError: (error: string | null) => void

  // Loading state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Projects state & operations
  projects: Project[]
  createProject: (name?: string) => boolean
  renameProject: (name?: string) => boolean
  deleteProject: () => boolean
}

const ProjectDialogsContext = React.createContext<ProjectDialogsContextValue | null>(null)

export function ProjectDialogsProvider({
  children,
  initialProjects = INITIAL_MOCK_PROJECTS,
}: {
  children: React.ReactNode
  initialProjects?: Project[]
}) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [activeDialog, setActiveDialog] = React.useState<DialogType>(null)
  const [targetProject, setTargetProject] = React.useState<Project | null>(null)
  const [projectName, setProjectName] = React.useState("")
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const slugPreview = React.useMemo(() => {
    return generateSlug(projectName)
  }, [projectName])

  const openCreateDialog = React.useCallback(() => {
    setActiveDialog("create")
    setTargetProject(null)
    setProjectName("")
    setFormError(null)
    setIsLoading(false)
  }, [])

  const openRenameDialog = React.useCallback((project: Project) => {
    setActiveDialog("rename")
    setTargetProject(project)
    setProjectName(project.name)
    setFormError(null)
    setIsLoading(false)
  }, [])

  const openDeleteDialog = React.useCallback((project: Project) => {
    setActiveDialog("delete")
    setTargetProject(project)
    setProjectName("")
    setFormError(null)
    setIsLoading(false)
  }, [])

  const closeDialog = React.useCallback(() => {
    setActiveDialog(null)
    setTargetProject(null)
    setProjectName("")
    setFormError(null)
    setIsLoading(false)
  }, [])

  const createProject = React.useCallback(
    (customName?: string): boolean => {
      const nameToUse = (customName ?? projectName).trim()
      if (!nameToUse) {
        setFormError("Project name is required")
        return false
      }

      const slug = generateSlug(nameToUse)
      if (!slug) {
        setFormError("Project name must contain at least one letter or number")
        return false
      }

      setIsLoading(true)
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: nameToUse,
        slug,
        isOwner: true,
        updatedAt: "Just now",
      }

      setProjects((prev) => [newProject, ...prev])
      closeDialog()
      return true
    },
    [projectName, closeDialog]
  )

  const renameProject = React.useCallback(
    (customName?: string): boolean => {
      if (!targetProject) return false
      const nameToUse = (customName ?? projectName).trim()
      if (!nameToUse) {
        setFormError("Project name is required")
        return false
      }

      const slug = generateSlug(nameToUse)
      if (!slug) {
        setFormError("Project name must contain at least one letter or number")
        return false
      }

      setIsLoading(true)
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === targetProject.id
            ? { ...proj, name: nameToUse, slug, updatedAt: "Just now" }
            : proj
        )
      )
      closeDialog()
      return true
    },
    [projectName, targetProject, closeDialog]
  )

  const deleteProject = React.useCallback((): boolean => {
    if (!targetProject) return false

    setIsLoading(true)
    setProjects((prev) => prev.filter((proj) => proj.id !== targetProject.id))
    closeDialog()
    return true
  }, [targetProject, closeDialog])

  const value = React.useMemo<ProjectDialogsContextValue>(
    () => ({
      activeDialog,
      isOpen: activeDialog !== null,
      targetProject,
      openCreateDialog,
      openRenameDialog,
      openDeleteDialog,
      closeDialog,
      projectName,
      setProjectName,
      slugPreview,
      formError,
      setFormError,
      isLoading,
      setIsLoading,
      projects,
      createProject,
      renameProject,
      deleteProject,
    }),
    [
      activeDialog,
      targetProject,
      openCreateDialog,
      openRenameDialog,
      openDeleteDialog,
      closeDialog,
      projectName,
      slugPreview,
      formError,
      isLoading,
      projects,
      createProject,
      renameProject,
      deleteProject,
    ]
  )

  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogs(): ProjectDialogsContextValue {
  const context = React.useContext(ProjectDialogsContext)
  if (!context) {
    throw new Error("useProjectDialogs must be used within a ProjectDialogsProvider")
  }
  return context
}
