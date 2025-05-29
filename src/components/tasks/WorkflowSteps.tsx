import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableStep } from "./SortableStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";

interface WorkflowStep {
  id: string;
  number: number;
  description: string;
  status: "Active" | "Completed" | "Ignored";
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
  onStepsChange: (steps: WorkflowStep[]) => void;
}

export function WorkflowSteps({ steps, onStepsChange }: WorkflowStepsProps) {
  const [newStepDescription, setNewStepDescription] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex).map(
        (step, index) => ({
          ...step,
          number: index + 1,
        }),
      );

      onStepsChange(newSteps);
    }
  };

  const handleAddStep = () => {
    if (!newStepDescription.trim()) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      number: steps.length + 1,
      description: newStepDescription.trim(),
      status: "Active",
    };

    onStepsChange([...steps, newStep]);
    setNewStepDescription("");
  };

  const handleStatusChange = (
    stepId: string,
    newStatus: WorkflowStep["status"],
  ) => {
    const newSteps = steps.map((step) =>
      step.id === stepId ? { ...step, status: newStatus } : step,
    );
    onStepsChange(newSteps);
  };

  const handleDescriptionChange = (stepId: string, newDescription: string) => {
    const newSteps = steps.map((step) =>
      step.id === stepId ? { ...step, description: newDescription } : step,
    );
    onStepsChange(newSteps);
  };

  return (
    <Card className="shadow rounded-xl border border-gray-200 bg-white">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-xl px-6 py-4 flex flex-row items-center gap-2">
        <Route className="text-blue-600" />
        <CardTitle className="text-base font-semibold text-gray-800">
          Workflow Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter step description..."
              value={newStepDescription}
              onChange={(e) => setNewStepDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
            />
            <Button onClick={handleAddStep}>Add Step</Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map((step) => step.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {steps.map((step) => (
                  <SortableStep
                    key={step.id}
                    step={step}
                    onStatusChange={handleStatusChange}
                    onDescriptionChange={handleDescriptionChange}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  );
}
