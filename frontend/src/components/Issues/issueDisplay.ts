import type { IssueStatus } from "@/client"

export const ISSUE_STATUSES: IssueStatus[] = ["Open", "In Progress", "Done"]

export const STATUS_BADGE_VARIANT: Record<
  IssueStatus,
  "default" | "secondary" | "outline"
> = {
  Open: "outline",
  "In Progress": "default",
  Done: "secondary",
}

export const PRIORITY_LABELS: Record<number, string> = {
  1: "P1 - Critical",
  2: "P2 - High",
  3: "P3 - Medium",
  4: "P4 - Low",
  5: "P5 - Trivial",
}

export const priorityLabel = (priority: number): string =>
  PRIORITY_LABELS[priority] ?? `P${priority}`
