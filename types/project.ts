export interface Project {
  id: string
  name: string
  slug: string
  isOwner: boolean
  updatedAt?: string
}

export type DialogType = "create" | "rename" | "delete" | null
