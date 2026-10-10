import { cache } from "react"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/slug"
import { formatRelativeTime } from "@/lib/date"
import { Project } from "@/types/project"

export interface UserProjectsData {
  ownedProjects: Project[]
  sharedProjects: Project[]
}

/**
 * Server-side project data helper to fetch owned and shared projects for a user.
 * Wrapped with React cache for deduplicated execution during request rendering.
 */
export const getUserProjects = cache(
  async (userId: string, userEmails: string[] = []): Promise<UserProjectsData> => {
    if (!userId) {
      return { ownedProjects: [], sharedProjects: [] }
    }

    const normalizedEmails = userEmails
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.length > 0)

    const [ownedDbProjects, sharedDbProjects] = await Promise.all([
      prisma.project.findMany({
        where: {
          ownerId: userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          collaborators: true,
        },
      }),
      normalizedEmails.length > 0
        ? prisma.project.findMany({
            where: {
              ownerId: {
                not: userId,
              },
              collaborators: {
                some: {
                  email: {
                    in: normalizedEmails,
                    mode: "insensitive",
                  },
                },
              },
            },
            orderBy: {
              updatedAt: "desc",
            },
            include: {
              collaborators: true,
            },
          })
        : Promise.resolve([]),
    ])

    const ownedProjects: Project[] = ownedDbProjects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: generateSlug(p.name),
      isOwner: true,
      updatedAt: formatRelativeTime(p.updatedAt),
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    }))

    const sharedProjects: Project[] = sharedDbProjects.map((p) => ({
      id: p.id,
      name: p.name,
      slug: generateSlug(p.name),
      isOwner: false,
      updatedAt: formatRelativeTime(p.updatedAt),
      description: p.description,
      createdAt: p.createdAt.toISOString(),
    }))

    return { ownedProjects, sharedProjects }
  }
)

export const getProjectsData = getUserProjects
