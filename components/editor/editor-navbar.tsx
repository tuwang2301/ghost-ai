"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onSidebarToggle: () => void
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen

  return (
    <nav className="fixed inset-x-0 top-0 z-40 flex h-14 items-center border-b border-surface-border bg-surface">
      <div className="flex w-16 items-center justify-start px-3">
        <Button
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
        >
          <SidebarIcon />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center" />
      <div className="w-16" aria-hidden="true" />
    </nav>
  )
}
