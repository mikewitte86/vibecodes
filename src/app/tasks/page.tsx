"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  AddTaskDialog,
  AddTaskFormValues,
} from "@/components/modals/AddTaskDialog";
import { RefreshCcw } from "lucide-react";
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

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Review Insurance Policy",
    description:
      "Review and update the insurance policy for client XYZ Review and update the insurance policy for client XYZ Review and update the insurance policy for client XYZ",
    assignee: "John Doe",
    createdDate: "2024-03-20",
    priority: "Medium",
    status: "Open",
    clientName: "XYZ Corp",
  },
  {
    id: "2",
    name: "Process Claim",
    description: "Process the claim for policy #12345",
    assignee: "Jane Smith",
    createdDate: "2024-03-19",
    priority: "Urgent",
    status: "Open",
    clientName: "ABC Inc",
  },
];

const mockUsers = [
  { name: "John Doe", value: "john.doe" },
  { name: "Jane Smith", value: "jane.smith" },
];

const mockWorkflows = [
  { name: "Policy Review", value: "policy_review" },
  { name: "Claim Processing", value: "claim_processing" },
];

const mockClients = [
  { name: "XYZ Corp", value: "xyz_corp" },
  { name: "ABC Inc", value: "abc_inc" },
];

const taskColumns = [
  {
    accessorKey: "name",
    header: "Task Name",
    size: 200,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.name} maxWidth="max-w-[200px]" />
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 300,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.description} maxWidth="max-w-[300px]" />
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    size: 150,
    cell: ({ row }: { row: Row<Task> }) => (
      <TruncatedCell text={row.original.assignee} maxWidth="max-w-[150px]" />
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    size: 150,
    cell: ({ row }: { row: Row<Task> }) =>
      new Date(row.original.createdDate).toLocaleDateString(),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 100,
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
    size: 100,
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

export default function TasksPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const columns = useMemo(() => taskColumns, []);

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track tasks</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>Add Task</Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <DataTable columns={columns} data={mockTasks} />
      </div>

      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(form: AddTaskFormValues) => {
          console.log("New task:", form);
          setAddDialogOpen(false);
        }}
        users={mockUsers}
        workflows={mockWorkflows}
        clients={mockClients}
      />
    </div>
  );
}
