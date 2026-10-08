import { auth } from "@clerk/nextjs/server"
import { EditorHome } from "@/components/editor/editor-home"

export const instant = false

export default async function EditorPage() {
  await auth.protect()

  return <EditorHome />
}
