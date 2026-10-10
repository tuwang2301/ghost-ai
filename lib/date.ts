export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const d = typeof date === "string" ? new Date(date) : date
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 1000))

  if (diffInSeconds < 60) return "Just now"
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays}d ago`
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`
  return d.toLocaleDateString()
}
