import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Check, Copy } from "lucide-react"

import type { IssuePublic } from "@/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"
import useAuth from "@/hooks/useAuth"
import { IssueActionsMenu } from "./IssueActionsMenu"
import { priorityLabel, STATUS_BADGE_VARIANT } from "./issueDisplay"

function CopyId({ id }: { id: string }) {
  const [copiedText, copy] = useCopyToClipboard()
  const isCopied = copiedText === id

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono text-xs text-muted-foreground">{id}</span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copy(id)}
      >
        {isCopied ? (
          <Check className="size-3 text-green-500" />
        ) : (
          <Copy className="size-3" />
        )}
        <span className="sr-only">Copy ID</span>
      </Button>
    </div>
  )
}

function IssueRowActions({ issue }: { issue: IssuePublic }) {
  const { user } = useAuth()
  const isOwner = user?.is_superuser || user?.id === issue.owner_id

  if (!isOwner) {
    return null
  }

  return <IssueActionsMenu issue={issue} />
}

export const columns: ColumnDef<IssuePublic>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <CopyId id={row.original.id} />,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        to="/issues/$issueId"
        params={{ issueId: row.original.id }}
        className="font-medium hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status ?? "Open"
      return <Badge variant={STATUS_BADGE_VARIANT[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {priorityLabel(row.original.priority ?? 3)}
      </span>
    ),
  },
  {
    accessorKey: "assignee_email",
    header: "Assignee",
    cell: ({ row }) => {
      const email = row.original.assignee_email
      return (
        <span
          className={
            email ? "text-sm" : "text-sm italic text-muted-foreground"
          }
        >
          {email || "Unassigned"}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <IssueRowActions issue={row.original} />
      </div>
    ),
  },
]
