import { auth, currentUser } from "@clerk/nextjs/server"
import { EditorShell } from "@/components/editor/editor-shell"
import { getUserProjects } from "@/lib/projects"

export const instant = false

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await auth.protect()
  const { userId } = await auth()
  const user = await currentUser()
  const emails = user?.emailAddresses?.map((e) => e.emailAddress) ?? []

  const { ownedProjects, sharedProjects } = userId
    ? await getUserProjects(userId, emails)
    : { ownedProjects: [], sharedProjects: [] }

  return (
    <EditorShell
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    >
      {children}
    </EditorShell>
  )
}
