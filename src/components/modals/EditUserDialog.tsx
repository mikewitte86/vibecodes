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
import { useForm, Controller } from "react-hook-form";
import { AGENCY_TYPES, USER_ROLES_TYPES } from "@/enums";
import { User } from "@/columns/users";
import { useEffect } from "react";

export type EditUserFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  role: USER_ROLES_TYPES;
  agency: AGENCY_TYPES;
};

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserEdit: (user: EditUserFormValues) => void;
  userRoles: { name: string; value: USER_ROLES_TYPES }[];
  agencies: { name: string; value: AGENCY_TYPES }[];
  user: User;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onUserEdit,
  userRoles,
  agencies,
  user,
}: EditUserDialogProps) {
  const [firstName, lastName] = user.name.split(" ");

  const userRole =
    userRoles.find((role) => role.name === user.role)?.value ||
    USER_ROLES_TYPES.USER;
  const userAgency =
    agencies.find((agency) => agency.name === user.agency)?.value ||
    AGENCY_TYPES.EQUAL_PARTS;

  const form = useForm<EditUserFormValues>({
    defaultValues: {
      firstName: firstName || "",
      lastName: lastName || "",
      email: user.email,
      role: userRole,
      agency: userAgency,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        firstName: firstName || "",
        lastName: lastName || "",
        email: user.email,
        role: userRole,
        agency: userAgency,
      });
    }
  }, [user, open, form, firstName, lastName, userRole, userAgency]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-md w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4 mt-2 px-4 pb-4"
          onSubmit={form.handleSubmit((data) => {
            onUserEdit(data);
            onOpenChange(false);
          })}
        >
          <div className="flex flex-col gap-1">
            <Label className="mb-1">First Name *</Label>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field }) => <Input required {...field} />}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="mb-1">Last Name *</Label>
            <Controller
              name="lastName"
              control={form.control}
              render={({ field }) => <Input required {...field} />}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="mb-1">Email Address *</Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field }) => <Input type="email" required {...field} />}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="mb-1">Role *</Label>
            <Controller
              name="role"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.name} value={role.value}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {form.watch("role") === USER_ROLES_TYPES.AGENCY_ADMIN && (
            <div className="flex flex-col gap-1 w-full">
              <Label className="mb-1">Agency *</Label>
              <Controller
                name="agency"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {agencies.map((agency) => (
                        <SelectItem key={agency.name} value={agency.value}>
                          {agency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer text-white font-semibold"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
