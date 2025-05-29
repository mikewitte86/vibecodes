import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkflowStep {
  id: string;
  number: number;
  description: string;
  status: "Active" | "Completed" | "Ignored";
}

interface SortableStepProps {
  step: WorkflowStep;
  onStatusChange: (stepId: string, status: WorkflowStep["status"]) => void;
  onDescriptionChange: (stepId: string, description: string) => void;
}

export function SortableStep({
  step,
  onStatusChange,
  onDescriptionChange,
}: SortableStepProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-4 bg-gray-50 border rounded-lg"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab hover:bg-gray-100 p-1 rounded"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-1 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 w-4">
          {step.number}.
        </span>
        <Input
          value={step.description}
          onChange={(e) => onDescriptionChange(step.id, e.target.value)}
          className="flex-1 bg-white"
        />
        <Select
          value={step.status}
          onValueChange={(value) =>
            onStatusChange(step.id, value as WorkflowStep["status"])
          }
        >
          <SelectTrigger className="w-[125px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Ignored">Ignored</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
