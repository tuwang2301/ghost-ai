import { clerkClient } from "@clerk/nextjs/server"

export interface EnrichedUser {
  email: string
  name: string | null
  avatarUrl: string | null
}

/**
 * Enriches a list of email addresses with user profile data (name, avatar) from Clerk Backend API.
 * If a Clerk user is not found or the API lookup fails, gracefully returns the email with null name/avatar.
 */
export async function getEnrichedUsersByEmails(
  emails: string[]
): Promise<Map<string, EnrichedUser>> {
  const result = new Map<string, EnrichedUser>()
  const uniqueEmails = Array.from(
    new Set(emails.map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0))
  )

  if (uniqueEmails.length === 0) {
    return result
  }

  // Initialize defaults
  for (const email of uniqueEmails) {
    result.set(email, {
      email,
      name: null,
      avatarUrl: null,
    })
  }

  try {
    const client = await clerkClient()
    const clerkUsersResponse = await client.users.getUserList({
      emailAddress: uniqueEmails,
      limit: 100,
    })

    const clerkUsers = clerkUsersResponse.data ?? []

    for (const user of clerkUsers) {
      const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
        user.username ||
        null
      const avatarUrl = user.imageUrl || null

      for (const emailObj of user.emailAddresses) {
        const normalized = emailObj.emailAddress.trim().toLowerCase()
        if (result.has(normalized)) {
          result.set(normalized, {
            email: normalized,
            name: displayName,
            avatarUrl,
          })
        }
      }
    }
  } catch (error) {
    // If Clerk lookup fails, fall back to email-only
    console.error("Failed to enrich collaborator emails from Clerk:", error)
  }

  return result
}
