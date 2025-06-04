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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Combobox, ComboboxOption } from "@/components/Combobox";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";

export interface AddApplicationFormValues {
  subAgency: string;
  applicationType: string;
  client: string;
  primaryContact: string;
}

interface AddApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: AddApplicationFormValues) => void;
  subAgencies: { name: string; value: string }[];
  applicationTypes: { name: string; value: string }[];
  isSubmitting?: boolean;
  error?: string | null;
}

export function AddApplicationDialog({
  open,
  onOpenChange,
  onSubmit,
  subAgencies,
  applicationTypes,
  isSubmitting,
  error,
}: AddApplicationDialogProps) {
  const { control, handleSubmit, reset, watch } =
    useForm<AddApplicationFormValues>({
      defaultValues: {
        subAgency: "",
        applicationType: "",
        client: "",
        primaryContact: "",
      },
    });

  const [clientOptions, setClientOptions] = useState<ComboboxOption[]>([]);
  const [contactOptions, setContactOptions] = useState<ComboboxOption[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);

  const selectedSubAgency = watch("subAgency");

  useEffect(() => {
    if (selectedSubAgency) {
      setClientsLoading(true);
      customerApi
        .getCustomers(selectedSubAgency)
        .then((res) => {
          setClientOptions(
            (res.body.customers || []).map((c) => ({
              value: c.id,
              label: c.name,
              status: c.status,
            })),
          );
        })
        .finally(() => setClientsLoading(false));
    } else {
      setClientOptions([]);
    }
    // Hide contacts until client is selected (optional)
    setContactOptions([]);
  }, [selectedSubAgency]);

  function handleDialogClose() {
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-lg w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>Create New Application</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mt-2 px-4 pb-4"
        >
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="subAgency">
              Sub-agency <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="subAgency"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sub-agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {subAgencies.map((agency) => (
                      <SelectItem key={agency.value} value={agency.value}>
                        {agency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationType">Application Type</Label>
            <Controller
              name="applicationType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select application type" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {selectedSubAgency && (
            <div className="space-y-2">
              <Label>Select Client</Label>
              <Controller
                name="client"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={clientOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      clientsLoading
                        ? "Loading clients..."
                        : "Search clients..."
                    }
                    disabled={isSubmitting || clientsLoading}
                    displayValue={(val) =>
                      clientOptions.find((c) => c.value === val)?.label || ""
                    }
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                disabled={isSubmitting}
              >
                + Add New Client
              </Button>
            </div>
          )}
          {selectedSubAgency && (
            <div className="space-y-2">
              <Label>Select Primary Contact</Label>
              <Controller
                name="primaryContact"
                control={control}
                render={({ field }) => (
                  <Combobox
                    options={contactOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Search contacts..."
                    disabled={isSubmitting}
                    displayValue={(val) =>
                      contactOptions.find((c) => c.value === val)?.label || ""
                    }
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full"
                disabled={isSubmitting}
              >
                + Add New Contact
              </Button>
            </div>
          )}
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
