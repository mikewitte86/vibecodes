"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { userColumns, User } from "@/columns/users";
import { AddUserDialog } from "@/components/modals/AddUserDialog";
import { AGENCY_TYPES, USER_ROLES_TYPES } from "@/enums";

const userRoles = [
  {
    name: "Super Admin",
    value: USER_ROLES_TYPES.SUPER_ADMIN,
  },
  {
    name: "Agency Admin",
    value: USER_ROLES_TYPES.AGENCY_ADMIN,
  },
  {
    name: "User",
    value: USER_ROLES_TYPES.USER,
  },
];
const agencies = [
  {
    name: "Equal Parts",
    value: AGENCY_TYPES.EQUAL_PARTS,
  },
  {
    name: "Lumen",
    value: AGENCY_TYPES.LUMEN,
  },
  {
    name: "Assurely",
    value: AGENCY_TYPES.ASSURELY,
  },
];

const initialUsers: User[] = [
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Super Admin",
    agency: "Lumen",
    lastActive: "2023-09-14 10:30 AM",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "User",
    agency: "Lumen",
    lastActive: "2023-09-14 09:15 AM",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Agency Admin",
    agency: "Assurely",
    lastActive: "2023-09-13 05:45 PM",
  },
  {
    name: "Mike Wilson",
    email: "mike.w@example.com",
    role: "User",
    agency: "Equal Parts",
    lastActive: "2023-09-10 11:20 AM",
  },
  {
    name: "Emily Brown",
    email: "emily.b@example.com",
    role: "User",
    agency: "Equal Parts",
    lastActive: "Never",
  },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const filteredUsers = users.filter(
    (u) =>
      (roleFilter === "all" || u.role === roleFilter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())),
  );

  function handleAddUser(form: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    agency: string;
  }) {
    const user: User = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      role: form.role,
      agency: form.agency,
      lastActive: "Never",
    };
    setUsers((prev) => [user, ...prev]);
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="px-4 sm:px-6 bg-gray-150 border-b border-gray-200 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage system users and their access
          </p>
        </div>
        <Button
          className="text-white font-semibold px-4 py-2 rounded-md cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          + New User
        </Button>
        <AddUserDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onUserAdd={handleAddUser}
          userRoles={userRoles}
          agencies={agencies}
        />
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={userColumns}
          data={filteredUsers}
          search={{
            value: search,
            onChange: setSearch,
            placeholder: "Search users...",
          }}
          filter={{
            value: roleFilter,
            onChange: setRoleFilter,
            options: [
              { value: "all", label: "All Roles" },
              ...userRoles.map((role) => ({
                value: role.value,
                label: role.name,
              })),
            ],
          }}
        />
      </div>
    </div>
  );
}
