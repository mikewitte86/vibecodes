export interface Task {
  id: string
  name: string
  description: string
  assignee: string
  createdDate: string
  createdBy: string
  priority: "Low" | "Medium" | "Urgent"
  status: "Open" | "Closed" | "Archived"
  clientName: string
  policyLOB: string
  policyId: string
  applicationName: string
  applicationId: string
  assignedWorkflow: string
  steps: {
    id: string
    number: number
    description: string
    status: "Active" | "Completed" | "Ignored"
  }[]
} 