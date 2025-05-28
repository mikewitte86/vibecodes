"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";

export type AddTaskFormValues = {
  name: string;
  description: string;
  clientName: string;
  clientContact?: string;
  policyLOB?: string;
  policyId?: string;
  applicationName?: string;
  applicationId?: string;
  assignedWorkflow?: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'Urgent';
  status: 'Open' | 'Closed' | 'Archived';
};

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: AddTaskFormValues) => void;
  users: { name: string; value: string }[];
  workflows: { name: string; value: string }[];
  clients: { name: string; value: string }[];
  isSubmitting?: boolean;
  error?: string | null;
}

export function AddTaskDialog({
  open,
  onOpenChange,
  onSubmit,
  users,
  workflows,
  clients,
  isSubmitting,
  error,
}: AddTaskDialogProps) {
  const { control, handleSubmit } = useForm<AddTaskFormValues>({
    defaultValues: {
      name: "",
      description: "",
      clientName: "",
      clientContact: "",
      policyLOB: "",
      policyId: "",
      applicationName: "",
      applicationId: "",
      assignedWorkflow: "",
      assignee: "",
      priority: "Medium",
      status: "Open",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-2xl w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>Add Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2 px-4 pb-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Task Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    required
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.value} value={client.value}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="description"
                  required
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientContact">Client Contact</Label>
              <Controller
                name="clientContact"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="clientContact"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedWorkflow">Assigned Workflow</Label>
              <Controller
                name="assignedWorkflow"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                    <SelectContent>
                      {workflows.map((workflow) => (
                        <SelectItem key={workflow.value} value={workflow.value}>
                          {workflow.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="policyLOB">Policy LOB</Label>
              <Controller
                name="policyLOB"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="policyLOB"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyId">Policy ID</Label>
              <Controller
                name="policyId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="policyId"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="applicationName">Application Name</Label>
              <Controller
                name="applicationName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="applicationName"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicationId">Application ID</Label>
              <Controller
                name="applicationId"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="applicationId"
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Controller
                name="assignee"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.value} value={user.value}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 