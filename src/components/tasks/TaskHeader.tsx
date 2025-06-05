import { Task } from "@/types/task";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

interface TaskHeaderProps {
  task: Task;
}

export function TaskHeader({ task }: TaskHeaderProps) {
  const priorityColor = {
    Low: "bg-blue-100 text-blue-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Urgent: "bg-red-100 text-red-800",
  }[task.priority];

  const statusColor = {
    Open: "bg-green-100 text-green-800",
    Closed: "bg-gray-100 text-gray-800",
    Archived: "bg-purple-100 text-purple-800",
  }[task.status];

  return (
    <Card className="shadow rounded-xl border border-gray-200 bg-white">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center gap-2">
        <BarChart2 className="text-blue-600" />
        <CardTitle className="text-base font-semibold text-gray-800">
          Task overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client Name</h3>
            <p className="mt-1 text-sm text-gray-900">{task.clientName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm text-gray-900">{task.description}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Policy</h3>
            <p className="mt-1 text-sm text-gray-900">
              {task.policyLOB} - {task.policyId}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Application</h3>
            <p className="mt-1 text-sm text-gray-900">
              {task.applicationName} - {task.applicationId}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Assigned Workflow
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {task.assignedWorkflow}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Priority</h3>
            <div className="mt-1">
              <StatusBadge value={task.priority} color={priorityColor} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Assignee</h3>
            <p className="mt-1 text-sm text-gray-900">{task.assignee}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <div className="mt-1">
              <StatusBadge value={task.status} color={statusColor} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created by</h3>
            <p className="mt-1 text-sm text-gray-900">{task.createdBy}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created at</h3>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(task.createdDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
