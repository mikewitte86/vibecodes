"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  AddTaskDialog,
  AddTaskFormValues,
} from "@/components/modals/AddTaskDialog";
import { RefreshCcw } from "lucide-react";
import { taskColumns } from "@/columns/tasks";
import { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Review Insurance Policy",
    description:
      "Process certificate request for Global Manufacturing Process certificate request for Global Manufacturing Process certificate request for Global Manufacturing",
    assignee: "John Doe",
    createdDate: "2024-03-20",
    priority: "Medium",
    status: "Open",
    clientName: "XYZ Corp",
    policyLOB: "Property",
    policyId: "POL-123",
    applicationName: "Policy Review",
    applicationId: "APP-456",
    assignedWorkflow: "Standard Review Process",
    createdBy: "Admin User",
    steps: [],
  },
  {
    id: "2",
    name: "Process Claim",
    description: "Process certificate request for Global Manufacturing",
    assignee: "Jane Smith",
    createdDate: "2024-03-19",
    priority: "Urgent",
    status: "Open",
    clientName: "ABC Inc",
    policyLOB: "Auto",
    policyId: "POL-456",
    applicationName: "Claim Processing",
    applicationId: "APP-789",
    assignedWorkflow: "Claim Workflow",
    createdBy: "Admin User",
    steps: [],
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
