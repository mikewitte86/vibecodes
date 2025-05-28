import { Row } from "@tanstack/react-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TruncatedCell } from "@/components/ui/truncated-cell";

interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  createdDate: string;
  priority: "Low" | "Medium" | "Urgent";
  status: "Open" | "Closed" | "Archived";
  clientName: string;
}

export const taskColumns = [
  {
    accessorKey: "name",
    header: "Task Name",
    size: 150,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.name} />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 300,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.description} />
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    size: 100,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.assignee} />
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    size: 100,
    cell: ({ row }: { row: Row<Task> }) =>
      new Date(row.original.createdDate).toLocaleDateString(),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 70,
    cell: ({ row }: { row: Row<Task> }) => {
      const priority = row.original.priority;
      const color = {
        Low: "bg-blue-100 text-blue-800",
        Medium: "bg-yellow-100 text-yellow-800",
        Urgent: "bg-red-100 text-red-800",
      }[priority];
      return <StatusBadge value={priority} color={color} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 70,
    cell: ({ row }: { row: Row<Task> }) => {
      const status = row.original.status;
      const color = {
        Open: "bg-green-100 text-green-800",
        Closed: "bg-gray-100 text-gray-800",
        Archived: "bg-purple-100 text-purple-800",
      }[status];
      return <StatusBadge value={status} color={color} />;
    },
  },
];
