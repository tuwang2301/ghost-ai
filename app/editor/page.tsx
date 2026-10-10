import { auth, currentUser } from "@clerk/nextjs/server"
import { EditorHome } from "@/components/editor/editor-home"
import { getUserProjects } from "@/lib/projects"

export const instant = false

export default async function EditorPage() {
  await auth.protect()
  const { userId } = await auth()
  const user = await currentUser()
  const emails = user?.emailAddresses?.map((e) => e.emailAddress) ?? []

  if (userId) {
    await getUserProjects(userId, emails)
  }

  return <EditorHome />
}
