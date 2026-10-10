import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteContext {
  params: Promise<{
    projectId: string
    collaboratorId: string
  }>
}

/**
 * DELETE /api/projects/[projectId]/collaborators/[collaboratorId]
 * Removes a collaborator from the project.
 * Enforces owner-only access.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, collaboratorId } = await context.params
    if (!projectId || !collaboratorId) {
      return NextResponse.json(
        { error: "Project ID and Collaborator ID are required" },
        { status: 400 }
      )
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Only owner can remove collaborators
    if (project.ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: only project owners can remove collaborators" },
        { status: 403 }
      )
    }

    // Verify collaborator belongs to this project
    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { id: collaboratorId },
    })

    if (!collaborator || collaborator.projectId !== projectId) {
      return NextResponse.json(
        { error: "Collaborator not found on this project" },
        { status: 404 }
      )
    }

    await prisma.projectCollaborator.delete({
      where: { id: collaboratorId },
    })

    revalidatePath(`/editor/${projectId}`)
    revalidatePath("/editor")

    return NextResponse.json({ success: true, id: collaboratorId })
  } catch (error) {
    console.error("Failed to remove collaborator:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
