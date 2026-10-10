"use client"

import * as React from "react"
import { Check, Copy, Loader2, Trash2, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface CollaboratorItem {
  id: string
  projectId: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
}

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

export function ShareDialog({
  isOpen,
  onClose,
  projectId,
  projectName,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = React.useState<CollaboratorItem[]>([])
  const [isOwner, setIsOwner] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [isInviting, setIsInviting] = React.useState(false)
  const [removingId, setRemovingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!isOpen || !projectId) return

    let isMounted = false

    const load = async () => {
      isMounted = true
      try {
        const res = await fetch(`/api/projects/${projectId}/collaborators`)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Failed to load collaborators")
        }
        const data = await res.json()
        if (isMounted) {
          setCollaborators(data.collaborators || [])
          setIsOwner(Boolean(data.isOwner))
          setError(null)
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : "Failed to load collaborators"
          setError(msg)
          setIsLoading(false)
        }
      }
    }

    // Defer async load to next tick so it doesn't trigger synchronous setState in effect
    const timer = setTimeout(() => {
      setIsLoading(true)
      load()
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [isOpen, projectId])

  // Copy project URL
  const handleCopyLink = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : ""
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  // Invite collaborator
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inviteEmail.trim().toLowerCase()
    if (!trimmed) return

    setIsInviting(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to invite collaborator")
      }
      const newCollab = await res.json()
      setCollaborators((prev) => [...prev, newCollab])
      setInviteEmail("")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to invite collaborator"
      setError(msg)
    } finally {
      setIsInviting(false)
    }
  }

  // Remove collaborator
  const handleRemove = async (collaboratorId: string) => {
    setRemovingId(collaboratorId)
    setError(null)
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to remove collaborator")
      }
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId))
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to remove collaborator"
      setError(msg)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface border-surface-border text-copy-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-copy-primary">
            <Users className="h-4 w-4 text-brand" />
            Share &ldquo;{projectName}&rdquo;
          </DialogTitle>
          <DialogDescription className="text-xs text-copy-muted">
            {isOwner
              ? "Invite collaborators by email or copy the project link."
              : "View project collaborators. Only the project owner can invite or remove members."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Copy link bar */}
          <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-subtle p-2">
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="min-w-0 flex-1 bg-transparent px-1.5 text-xs text-copy-secondary outline-none select-all"
            />
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleCopyLink}
              className="shrink-0 gap-1 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-state-success" />
                  <span className="text-state-success font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>
          </div>

          {/* Owner Invite Form */}
          {isOwner && (
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={isInviting}
                className="h-9 flex-1 bg-subtle border-surface-border text-sm text-copy-primary placeholder:text-copy-muted focus-visible:border-brand"
              />
              <Button
                type="submit"
                disabled={isInviting || !inviteEmail.trim()}
                className="h-9 px-3 text-xs shrink-0"
              >
                {isInviting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-state-error/20 bg-state-error/10 p-2 text-xs text-state-error">
              {error}
            </div>
          )}

          {/* Collaborator List */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-copy-muted">
              Collaborators ({collaborators.length})
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-copy-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : collaborators.length === 0 ? (
              <div className="rounded-xl border border-dashed border-surface-border p-4 text-center text-xs text-copy-muted">
                No collaborators yet
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {collaborators.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-subtle p-2 border border-surface-border"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {c.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.avatarUrl}
                          alt={c.name || c.email}
                          className="h-7 w-7 rounded-full object-cover shrink-0 border border-surface-border"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface border border-surface-border text-copy-muted shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="min-w-0 flex flex-col text-left">
                        {c.name && (
                          <span className="truncate text-xs font-medium text-copy-primary">
                            {c.name}
                          </span>
                        )}
                        <span className="truncate text-[11px] text-copy-muted">
                          {c.email}
                        </span>
                      </div>
                    </div>

                    {isOwner && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={removingId === c.id}
                        onClick={() => handleRemove(c.id)}
                        aria-label={`Remove ${c.email}`}
                        className="text-copy-muted hover:text-state-error shrink-0"
                      >
                        {removingId === c.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
