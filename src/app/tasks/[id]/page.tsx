"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { TaskHeader } from "@/components/tasks/TaskHeader";
import { WorkflowSteps } from "@/components/tasks/WorkflowSteps";
import { Task } from "@/types/task";

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Review Insurance Policy",
    description: "Review and update the insurance policy for client XYZ",
    assignee: "John Doe",
    createdDate: "2024-03-20",
    createdBy: "Admin User",
    priority: "Urgent",
    status: "Open",
    clientName: "XYZ Corporation",
    policyLOB: "Property",
    policyId: "POL-123",
    applicationName: "Policy Review",
    applicationId: "APP-456",
    assignedWorkflow: "Standard Review Process",
    steps: [
      {
        id: "step-1",
        number: 1,
        description: "Review policy terms and conditions",
        status: "Active",
      },
      {
        id: "step-2",
        number: 2,
        description: "Verify coverage limits",
        status: "Completed",
      },
      {
        id: "step-3",
        number: 3,
        description: "Check for any exclusions",
        status: "Ignored",
      },
    ],
  },
];

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | undefined>(
    mockTasks.find((t) => t.id === taskId),
  );

  if (!task) {
    return (
      <div className="space-y-8 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
        </div>
      </div>
    );
  }

  const handleStepsChange = (newSteps: Task["steps"]) => {
    setTask((prev) => {
      if (!prev) return prev;
      return { ...prev, steps: newSteps };
    });
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{task.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Review and manage task</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-8">
        <TaskHeader task={task} />
        <WorkflowSteps steps={task.steps} onStepsChange={handleStepsChange} />
      </div>
    </div>
  );
}
