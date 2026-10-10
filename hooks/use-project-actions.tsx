"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { generateSlug } from "@/lib/slug"
import { DialogType, Project } from "@/types/project"

function generateShortSuffix(): string {
  return Math.random().toString(36).substring(2, 6)
}

export interface ProjectActionsContextValue {
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
  suffix: string
  roomIdPreview: string
  slugPreview: string
  formError: string | null
  setFormError: (error: string | null) => void

  // Loading state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Projects state
  projects: Project[]
  ownedProjects: Project[]
  sharedProjects: Project[]

  // Mutations
  createProject: (customName?: string) => Promise<boolean>
  renameProject: (customName?: string) => Promise<boolean>
  deleteProject: () => Promise<boolean>
}

const ProjectActionsContext = React.createContext<ProjectActionsContextValue | null>(null)

interface ProjectActionsProviderProps {
  children: React.ReactNode
  initialProjects?: Project[]
  ownedProjects?: Project[]
  sharedProjects?: Project[]
}

export function ProjectActionsProvider({
  children,
  initialProjects,
  ownedProjects: initialOwned = [],
  sharedProjects: initialShared = [],
}: ProjectActionsProviderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const initialKey = React.useMemo(() => {
    const list = initialProjects ?? [...initialOwned, ...initialShared]
    return list.map((p) => `${p.id}:${p.name}`).join(";")
  }, [initialProjects, initialOwned, initialShared])

  const [prevKey, setPrevKey] = React.useState(initialKey)
  const [projects, setProjects] = React.useState<Project[]>(() => {
    return initialProjects ?? [...initialOwned, ...initialShared]
  })
  const [activeDialog, setActiveDialog] = React.useState<DialogType>(null)
  const [targetProject, setTargetProject] = React.useState<Project | null>(null)
  const [projectName, setProjectName] = React.useState("")
  const [suffix, setSuffix] = React.useState(generateShortSuffix())
  const [formError, setFormError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  if (prevKey !== initialKey) {
    setPrevKey(initialKey)
    setProjects(initialProjects ?? [...initialOwned, ...initialShared])
  }

  const ownedProjects = React.useMemo(
    () => projects.filter((p) => p.isOwner),
    [projects]
  )

  const sharedProjects = React.useMemo(
    () => projects.filter((p) => !p.isOwner),
    [projects]
  )

  const roomIdPreview = React.useMemo(() => {
    const baseSlug = generateSlug(projectName) || "untitled-project"
    return suffix ? `${baseSlug}-${suffix}` : baseSlug
  }, [projectName, suffix])

  const openCreateDialog = React.useCallback(() => {
    setActiveDialog("create")
    setTargetProject(null)
    setProjectName("")
    setSuffix(generateShortSuffix())
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
    async (customName?: string): Promise<boolean> => {
      const nameToUse = (customName ?? projectName).trim()
      const finalName = nameToUse.length > 0 ? nameToUse : "Untitled Project"
      const baseSlug = generateSlug(finalName) || "untitled-project"
      const roomId = suffix ? `${baseSlug}-${suffix}` : baseSlug

      setIsLoading(true)
      setFormError(null)

      try {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: finalName,
            id: roomId,
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to create project")
        }

        const newProject = await response.json()
        setProjects((prev) => [
          {
            id: newProject.id,
            name: newProject.name,
            slug: generateSlug(newProject.name),
            isOwner: true,
            updatedAt: "Just now",
          },
          ...prev,
        ])
        closeDialog()
        router.push(`/editor/${newProject.id}`)
        router.refresh()
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create project"
        setFormError(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectName, suffix, closeDialog, router]
  )

  const renameProject = React.useCallback(
    async (customName?: string): Promise<boolean> => {
      if (!targetProject) return false
      const targetId = targetProject.id
      const nameToUse = (customName ?? projectName).trim()

      if (!nameToUse) {
        setFormError("Project name is required")
        return false
      }

      setIsLoading(true)
      setFormError(null)

      try {
        const response = await fetch(`/api/projects/${targetId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nameToUse,
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw new Error(errData.error || "Failed to rename project")
        }

        setProjects((prev) =>
          prev.map((p) =>
            p.id === targetId
              ? {
                  ...p,
                  name: nameToUse,
                  slug: generateSlug(nameToUse),
                  updatedAt: "Just now",
                }
              : p
          )
        )
        closeDialog()
        router.refresh()
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to rename project"
        setFormError(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [projectName, targetProject, closeDialog, router]
  )

  const deleteProject = React.useCallback(async (): Promise<boolean> => {
    if (!targetProject) return false
    const targetId = targetProject.id

    setIsLoading(true)
    setFormError(null)

    try {
      const response = await fetch(`/api/projects/${targetId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to delete project")
      }

      setProjects((prev) => prev.filter((p) => p.id !== targetId))
      closeDialog()

      const isDeletingActive = pathname === `/editor/${targetId}`
      if (isDeletingActive) {
        router.push("/editor")
      } else {
        router.refresh()
      }

      return true
    } catch (err) {
      console.error("Failed to delete project:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [targetProject, pathname, closeDialog, router])

  const value = React.useMemo<ProjectActionsContextValue>(
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
      suffix,
      roomIdPreview,
      slugPreview: roomIdPreview,
      formError,
      setFormError,
      isLoading,
      setIsLoading,
      projects,
      ownedProjects,
      sharedProjects,
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
      suffix,
      roomIdPreview,
      formError,
      isLoading,
      projects,
      ownedProjects,
      sharedProjects,
      createProject,
      renameProject,
      deleteProject,
    ]
  )

  return (
    <ProjectActionsContext.Provider value={value}>
      {children}
    </ProjectActionsContext.Provider>
  )
}

export function useProjectActions(): ProjectActionsContextValue {
  const context = React.useContext(ProjectActionsContext)
  if (!context) {
    throw new Error("useProjectActions must be used within a ProjectActionsProvider")
  }
  return context
}

// Re-export alias for compatibility with existing useProjectDialogs callers
export const useProjectDialogs = useProjectActions
export const ProjectDialogsProvider = ProjectActionsProvider
