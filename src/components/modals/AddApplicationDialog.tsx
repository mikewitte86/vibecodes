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
import { useState } from "react";

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
  clients: { value: string; label: string; status?: string }[];
  contacts: { value: string; label: string }[];
  isSubmitting?: boolean;
  error?: string | null;
}

export function AddApplicationDialog({
  open,
  onOpenChange,
  onSubmit,
  subAgencies,
  applicationTypes,
  clients,
  contacts,
  isSubmitting,
  error,
}: AddApplicationDialogProps) {
  const { control, handleSubmit, reset } = useForm<AddApplicationFormValues>({
    defaultValues: {
      subAgency: "",
      applicationType: "",
      client: "",
      primaryContact: "",
    },
  });

  const [clientQuery, setClientQuery] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const filteredClients =
    clientQuery === ""
      ? clients
      : clients.filter((c) =>
          c.label.toLowerCase().includes(clientQuery.toLowerCase()),
        );
  const filteredContacts =
    contactQuery === ""
      ? contacts
      : contacts.filter((c) =>
          c.label.toLowerCase().includes(contactQuery.toLowerCase()),
        );

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
          <div className="space-y-2">
            <Label>Select Client</Label>
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={filteredClients as ComboboxOption[]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search clients from Hubspot..."
                  disabled={isSubmitting}
                  displayValue={(val) =>
                    clients.find((c) => c.value === val)?.label || ""
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
          <div className="space-y-2">
            <Label>Select Primary Contact</Label>
            <Controller
              name="primaryContact"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={filteredContacts as ComboboxOption[]}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search contacts from Hubspot..."
                  disabled={isSubmitting}
                  displayValue={(val) =>
                    contacts.find((c) => c.value === val)?.label || ""
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
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Review Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
