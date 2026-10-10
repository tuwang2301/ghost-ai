import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RenameProjectInput {
  name?: string
}

interface RouteParams {
  params: Promise<{
    projectId: string
  }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId } = await params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let body: RenameProjectInput = {}
    try {
      body = (await request.json()) as RenameProjectInput
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const trimmedName = typeof body.name === "string" ? body.name.trim() : ""
    if (!trimmedName) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: trimmedName,
      },
      include: {
        collaborators: true,
      },
    })

    revalidatePath("/editor")
    revalidatePath("/editor", "layout")

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Failed to rename project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId } = await params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.ownerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.project.delete({
      where: { id: projectId },
    })

    revalidatePath("/editor")
    revalidatePath("/editor", "layout")

    return NextResponse.json({ success: true, id: projectId })
  } catch (error) {
    console.error("Failed to delete project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
