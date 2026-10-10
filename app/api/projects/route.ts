import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthUserId } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface CreateProjectInput {
  id?: string
  name?: string
  description?: string
}

export async function GET() {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        collaborators: true,
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to list projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: CreateProjectInput = {}
    try {
      body = (await request.json()) as CreateProjectInput
    } catch {
      body = {}
    }

    const trimmedName = typeof body.name === "string" ? body.name.trim() : ""
    const name = trimmedName.length > 0 ? trimmedName : "Untitled Project"
    const description =
      typeof body.description === "string" && body.description.trim().length > 0
        ? body.description.trim()
        : null

    const customId =
      typeof body.id === "string" && body.id.trim().length > 0
        ? body.id.trim()
        : undefined

    const project = await prisma.project.create({
      data: {
        ...(customId ? { id: customId } : {}),
        name,
        description,
        ownerId: userId,
      },
      include: {
        collaborators: true,
      },
    })

    revalidatePath("/editor")
    revalidatePath("/editor", "layout")

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
