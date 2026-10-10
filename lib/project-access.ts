import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface UserIdentity {
  userId: string | null
  email: string | null
}

export interface ProjectAccessResult {
  hasAccess: boolean
  isOwner: boolean
  project: {
    id: string
    name: string
    description: string | null
    ownerId: string
    status: string
    canvasJsonPath: string | null
    createdAt: Date
    updatedAt: Date
  } | null
}

/**
 * Retrieves the currently authenticated Clerk identity: userId and primary email address.
 * Returns null values if the user is unauthenticated.
 */
export async function getCurrentIdentity(): Promise<UserIdentity> {
  const session = await auth()
  const userId = session.userId ?? null

  if (!userId) {
    return { userId: null, email: null }
  }

  const user = await currentUser()
  const primaryEmail =
    user?.emailAddresses?.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null

  return {
    userId,
    email: primaryEmail ? primaryEmail.trim().toLowerCase() : null,
  }
}

/**
 * Checks whether the user has access to the specified project by owner or collaborator role.
 * If identity is not explicitly supplied, it is resolved from the current Clerk session.
 */
export async function checkProjectAccess(
  projectId: string,
  userId?: string | null,
  userEmail?: string | null
): Promise<ProjectAccessResult> {
  let resolvedUserId = userId
  let resolvedEmail = userEmail

  if (resolvedUserId === undefined) {
    const identity = await getCurrentIdentity()
    resolvedUserId = identity.userId
    resolvedEmail = identity.email
  }

  if (!resolvedUserId) {
    return { hasAccess: false, isOwner: false, project: null }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  })

  if (!project) {
    return { hasAccess: false, isOwner: false, project: null }
  }

  // Owner access
  if (project.ownerId === resolvedUserId) {
    return { hasAccess: true, isOwner: true, project }
  }

  // Collaborator access
  if (resolvedEmail) {
    const normalizedEmail = resolvedEmail.trim().toLowerCase()
    const isCollaborator = project.collaborators.some(
      (c) => c.email.trim().toLowerCase() === normalizedEmail
    )

    if (isCollaborator) {
      return { hasAccess: true, isOwner: false, project }
    }
  }

  return { hasAccess: false, isOwner: false, project: null }
}
