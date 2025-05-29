"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Task } from "@/types/task"
import { StatusBadge } from "@/components/ui/status-badge"
import { TruncatedCell } from "@/components/ui/truncated-cell"
import { useRouter } from "next/navigation"

function ClickableCell({ text, id }: { text: string; id: string }) {
  const router = useRouter()
  return (
    <div
      className="cursor-pointer hover:text-blue-600"
      onClick={() => router.push(`/tasks/${id}`)}
    >
      <TruncatedCell text={text} />
    </div>
  )
}

export const taskColumns: ColumnDef<Task, unknown>[] = [
  {
    accessorKey: "name",
    header: "Task Name",
    size: 150,
    cell: ({ row }) => (
      <ClickableCell text={row.getValue("name")} id={row.original.id} />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 300,
    cell: ({ row }) => <TruncatedCell text={row.getValue("description")} />,
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    size: 100,
    cell: ({ row }) => <TruncatedCell text={row.getValue("assignee")} />,
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    size: 100,
    cell: ({ row }) => new Date(row.getValue("createdDate")).toLocaleDateString(),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 70,
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <StatusBadge
          status={priority}
          variant={
            priority === "Urgent"
              ? "destructive"
              : priority === "Medium"
              ? "warning"
              : "default"
          }
        />
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 70,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <StatusBadge
          status={status}
          variant={
            status === "Open"
              ? "default"
              : status === "Closed"
              ? "success"
              : "secondary"
          }
        />
      )
    },
  },
]
