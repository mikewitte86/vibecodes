"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isSubmitting?: boolean;
  error?: string | null;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isSubmitting,
  error,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <p className="text-gray-600">{description}</p>
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
