import Link from "next/link"
import { Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col items-center max-w-md space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface text-copy-muted shadow-sm">
          <Lock className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold text-copy-primary">Access Denied</h2>
          <p className="text-sm text-copy-muted">
            You do not have access to this project, or it does not exist.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/editor"
            className={buttonVariants({ variant: "outline" })}
          >
            Back to Editor
          </Link>
        </div>
      </div>
    </div>
  )
}
