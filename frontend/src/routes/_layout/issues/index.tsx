import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { Suspense } from "react"
import { z } from "zod"

import { IssuesService } from "@/client"
import { DataTable } from "@/components/Common/DataTable"
import AddIssue from "@/components/Issues/AddIssue"
import { columns } from "@/components/Issues/columns"
import { ISSUE_STATUSES, priorityLabel } from "@/components/Issues/issueDisplay"
import PendingIssues from "@/components/Pending/PendingIssues"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useAuth from "@/hooks/useAuth"

const ALL_VALUE = "all"

const searchSchema = z.object({
  status: z.enum(["Open", "In Progress", "Done"]).optional().catch(undefined),
  priority: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  assignedToMe: z.boolean().optional().catch(undefined),
})

type IssuesSearch = z.infer<typeof searchSchema>

export const Route = createFileRoute("/_layout/issues/")({
  component: Issues,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      {
        title: "Issues - FastAPI Template",
      },
    ],
  }),
})

function getIssuesQueryOptions(search: IssuesSearch, assigneeId?: string) {
  return {
    queryFn: () =>
      IssuesService.readIssues({
        skip: 0,
        limit: 100,
        status: search.status,
        priority: search.priority,
        assigneeId: search.assignedToMe ? assigneeId : undefined,
      }),
    queryKey: ["issues", search, search.assignedToMe ? assigneeId : undefined],
  }
}

function IssueFilters({ search }: { search: IssuesSearch }) {
  const navigate = useNavigate({ from: Route.fullPath })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={search.status ?? ALL_VALUE}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({
              ...prev,
              status: value === ALL_VALUE ? undefined : (value as IssuesSearch["status"]),
            }),
          })
        }
      >
        <SelectTrigger className="w-[160px]" aria-label="Filter by status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
          {ISSUE_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={search.priority ? String(search.priority) : ALL_VALUE}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({
              ...prev,
              priority: value === ALL_VALUE ? undefined : Number(value),
            }),
          })
        }
      >
        <SelectTrigger className="w-[180px]" aria-label="Filter by priority">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All priorities</SelectItem>
          {[1, 2, 3, 4, 5].map((priority) => (
            <SelectItem key={priority} value={String(priority)}>
              {priorityLabel(priority)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={search.assignedToMe ? "default" : "outline"}
        onClick={() =>
          navigate({
            search: (prev) => ({
              ...prev,
              assignedToMe: !prev.assignedToMe || undefined,
            }),
          })
        }
      >
        Assigned to me
      </Button>
    </div>
  )
}

function IssuesTableContent({ search }: { search: IssuesSearch }) {
  const { user } = useAuth()
  const { data: issues } = useSuspenseQuery(
    getIssuesQueryOptions(search, user?.id),
  )

  if (issues.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          You don't have any issues yet
        </h3>
        <p className="text-muted-foreground">
          Add a new issue to get started
        </p>
      </div>
    )
  }

  return <DataTable columns={columns} data={issues.data} />
}

function IssuesTable({ search }: { search: IssuesSearch }) {
  return (
    <Suspense fallback={<PendingIssues />}>
      <IssuesTableContent search={search} />
    </Suspense>
  )
}

function Issues() {
  const search = Route.useSearch()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issues</h1>
          <p className="text-muted-foreground">
            Create and manage your issues
          </p>
        </div>
        <AddIssue />
      </div>
      <IssueFilters search={search} />
      <IssuesTable search={search} />
    </div>
  )
}
