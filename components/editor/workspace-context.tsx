"use client"

import * as React from "react"

export interface WorkspaceContextValue {
  projectName: string | null
  setProjectName: (name: string | null) => void
  isAiOpen: boolean
  setIsAiOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleAi: () => void
  isShareOpen: boolean
  setIsShareOpen: React.Dispatch<React.SetStateAction<boolean>>
  openShare: () => void
  closeShare: () => void
}

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [projectName, setProjectName] = React.useState<string | null>(null)
  const [isAiOpen, setIsAiOpen] = React.useState(false)
  const [isShareOpen, setIsShareOpen] = React.useState(false)

  const toggleAi = React.useCallback(() => {
    setIsAiOpen((prev) => !prev)
  }, [])

  const openShare = React.useCallback(() => {
    setIsShareOpen(true)
  }, [])

  const closeShare = React.useCallback(() => {
    setIsShareOpen(false)
  }, [])

  const value = React.useMemo(
    () => ({
      projectName,
      setProjectName,
      isAiOpen,
      setIsAiOpen,
      toggleAi,
      isShareOpen,
      setIsShareOpen,
      openShare,
      closeShare,
    }),
    [projectName, isAiOpen, toggleAi, isShareOpen, openShare, closeShare]
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace(): WorkspaceContextValue | null {
  return React.useContext(WorkspaceContext)
}
