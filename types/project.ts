export interface Project {
  id: string
  name: string
  slug: string
  isOwner: boolean
  updatedAt?: string
  description?: string | null
  createdAt?: string | Date
}

export type DialogType = "create" | "rename" | "delete" | null
