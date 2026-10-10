import { auth } from "@clerk/nextjs/server"
import { checkProjectAccess } from "@/lib/project-access"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

interface WorkspacePageProps {
  params: Promise<{
    roomId: string
  }>
}

export const instant = false

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  await auth.protect()
  const { roomId } = await params

  const { hasAccess, project } = await checkProjectAccess(roomId)

  if (!hasAccess || !project) {
    return <AccessDenied />
  }

  return <WorkspaceShell project={project} />
}
