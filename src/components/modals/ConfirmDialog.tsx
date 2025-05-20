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
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Yes",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && (
          <div 
            className="pt-0 p-4 text-sm text-gray-500"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
        <DialogFooter className="flex flex-row gap-2 justify-end p-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
