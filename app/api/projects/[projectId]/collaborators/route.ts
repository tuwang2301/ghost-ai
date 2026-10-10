import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getAuthUserId } from "@/lib/auth"
import { getCurrentIdentity } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"
import { getEnrichedUsersByEmails } from "@/lib/clerk-users"

interface RouteContext {
  params: Promise<{
    projectId: string
  }>
}

/**
 * GET /api/projects/[projectId]/collaborators
 * Lists all collaborators for the given project, enriched with Clerk user data.
 * Accessible to owner or existing collaborators.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId, email: userEmail } = await getCurrentIdentity()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId } = await context.params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        collaborators: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isOwner = project.ownerId === userId
    const isCollaborator = Boolean(
      userEmail &&
      project.collaborators.some(
        (c) => c.email.trim().toLowerCase() === userEmail.trim().toLowerCase()
      )
    )

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Enrich collaborator emails with Clerk user profiles
    const collaboratorEmails = project.collaborators.map((c) => c.email)
    const enrichedMap = await getEnrichedUsersByEmails(collaboratorEmails)

    const collaborators = project.collaborators.map((c) => {
      const enriched = enrichedMap.get(c.email.trim().toLowerCase())
      return {
        id: c.id,
        projectId: c.projectId,
        email: c.email,
        name: enriched?.name ?? null,
        avatarUrl: enriched?.avatarUrl ?? null,
        createdAt: c.createdAt.toISOString(),
      }
    })

    return NextResponse.json({
      isOwner,
      ownerId: project.ownerId,
      collaborators,
    })
  } catch (error) {
    console.error("Failed to list collaborators:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects/[projectId]/collaborators
 * Invites a new collaborator by email.
 * Enforces owner-only access.
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const userId = await getAuthUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId } = await context.params
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        collaborators: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Only owners can invite collaborators
    if (project.ownerId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: only project owners can invite collaborators" },
        { status: 403 }
      )
    }

    let body: { email?: string } = {}
    try {
      body = (await request.json()) as { email?: string }
    } catch {
      body = {}
    }

    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Check if already a collaborator
    const existing = project.collaborators.find(
      (c) => c.email.trim().toLowerCase() === rawEmail
    )
    if (existing) {
      return NextResponse.json(
        { error: "This user is already a collaborator on this project" },
        { status: 409 }
      )
    }

    let collaborator
    try {
      collaborator = await prisma.projectCollaborator.create({
        data: { projectId, email: rawEmail },
      })
    } catch (err) {
      if ((err as { code?: string })?.code === "P2002") {
        return NextResponse.json(
          { error: "This user is already a collaborator on this project" },
          { status: 409 }
        )
      }
      throw err
    }


    // Enrich with Clerk user profile
    const enrichedMap = await getEnrichedUsersByEmails([rawEmail])
    const enriched = enrichedMap.get(rawEmail)

    revalidatePath(`/editor/${projectId}`)
    revalidatePath("/editor")

    return NextResponse.json(
      {
        id: collaborator.id,
        projectId: collaborator.projectId,
        email: collaborator.email,
        name: enriched?.name ?? null,
        avatarUrl: enriched?.avatarUrl ?? null,
        createdAt: collaborator.createdAt.toISOString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to invite collaborator:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
