import { Project } from "@/types/project"

export const INITIAL_MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Market-ops architecture",
    slug: "market-ops-architecture",
    isOwner: true,
    updatedAt: "2h ago",
  },
  {
    id: "proj-2",
    name: "Real-time analytics pipeline",
    slug: "real-time-analytics-pipeline",
    isOwner: true,
    updatedAt: "Yesterday",
  },
  {
    id: "proj-3",
    name: "Auth & billing service",
    slug: "auth-billing-service",
    isOwner: true,
    updatedAt: "3d ago",
  },
  {
    id: "proj-4",
    name: "Infrastructure ingress gateway",
    slug: "infrastructure-ingress-gateway",
    isOwner: false,
    updatedAt: "5d ago",
  },
  {
    id: "proj-5",
    name: "Edge cache distribution",
    slug: "edge-cache-distribution",
    isOwner: false,
    updatedAt: "1w ago",
  },
]
