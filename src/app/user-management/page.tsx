"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { userColumns, User } from "@/columns/users";
import { AddUserDialog } from "@/components/modals/AddUserDialog";
import { EditUserDialog } from "@/components/modals/EditUserDialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { AGENCY_TYPES, USER_ROLES_TYPES } from "@/enums";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";

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
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      roleFilter === "all" ||
      userRoles.find((role) => role.value === roleFilter)?.name === u.role;
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

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

  function handleEditUser(form: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    agency: string;
  }) {
    if (!selectedUser) return;

    const updatedUser: User = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      role: form.role,
      agency: form.agency,
      lastActive: selectedUser.lastActive,
    };

    setUsers((prev) =>
      prev.map((user) =>
        user.email === selectedUser.email ? updatedUser : user,
      ),
    );
  }

  function handleDeleteUser() {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.filter((user) => user.email !== selectedUser.email),
    );
  }

  const columns = [
    ...userColumns,
    {
      id: "actions",
      header: "",
      size: 50,
      cell: ({ row }: { row: Row<User> }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setSelectedUser(row.original);
                  setEditDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(row.original);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600 hover:!text-red-600 cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

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
          onClick={() => setAddDialogOpen(true)}
        >
          + New User
        </Button>
        <AddUserDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onUserAdd={handleAddUser}
          userRoles={userRoles}
          agencies={agencies}
        />
        {selectedUser && (
          <>
            <EditUserDialog
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
              onUserEdit={handleEditUser}
              userRoles={userRoles}
              agencies={agencies}
              user={selectedUser}
            />
            <ConfirmDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              onConfirm={handleDeleteUser}
              title="Delete User"
              description={`Are you sure you want to delete <strong>${selectedUser.name}</strong>?`}
              confirmText="Delete"
            />
          </>
        )}
      </div>
      <div className="px-4 sm:px-6">
        <DataTable
          columns={columns}
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
