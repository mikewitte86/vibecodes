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
import { AGENCY_TYPES, USER_ROLES_TYPES } from "@/enums";
import { User } from "@/types/api";
import { useEffect, useState } from "react";

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
  onSubmit: (form: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    agency: string;
  }) => void;
  user: User | null;
  agencies: { name: string; value: string }[];
  userRoles: { name: string; value: string }[];
  isSubmitting?: boolean;
  error?: string | null;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  agencies,
  userRoles,
  isSubmitting,
  error,
}: EditUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [agency, setAgency] = useState("");

  useEffect(() => {
    if (user) {
      const [first, last] = user.name.split(" ");
      setFirstName(first || "");
      setLastName(last || "");
      setEmail(user.email);
      setRole(user.user_role);
      setAgency(user.agency_id);
    }
  }, [user]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      firstName,
      lastName,
      email,
      role,
      agency: role === USER_ROLES_TYPES.AGENCY_ADMIN ? agency : "",
    });
    onOpenChange(false);
  }

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-md w-full !p-0">
        <DialogHeader className="bg-gray-150 border-b border-gray-200 p-4">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2 px-4 pb-4">
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {role === USER_ROLES_TYPES.AGENCY_ADMIN && (
            <div className="space-y-2">
              <Label htmlFor="agency">Agency</Label>
              <Select value={agency} onValueChange={setAgency} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agency" />
                </SelectTrigger>
                <SelectContent>
                  {agencies.map((agency) => (
                    <SelectItem key={agency.value} value={agency.value}>
                      {agency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
