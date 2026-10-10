import { auth } from "@clerk/nextjs/server"

let mockUserId: string | null | undefined = undefined

/**
 * For testing purposes only: override the authenticated user ID when NODE_ENV === 'test'.
 */
export function setMockAuthUserId(id: string | null | undefined) {
  mockUserId = id
}

/**
 * Shared access control helper to get the authenticated Clerk user ID.
 * Returns null if the request is unauthenticated.
 */
export async function getAuthUserId(): Promise<string | null> {
  if (process.env.NODE_ENV === "test" && mockUserId !== undefined) {
    return mockUserId
  }

  const session = await auth()
  return session.userId ?? null
}
