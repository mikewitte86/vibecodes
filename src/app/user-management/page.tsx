"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { userColumns } from "@/columns/users";
import { AddUserDialog } from "@/components/modals/AddUserDialog";
import { EditUserDialog } from "@/components/modals/EditUserDialog";
import { ConfirmDialog } from "@/components/modals/ConfirmDialog";
import { AGENCY_TYPES, USER_ROLES_TYPES } from "@/enums";
import { MoreVertical, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";
import { User } from "@/types/api";
import { cn } from "@/lib/utils";

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

interface UsersResponse {
  users: User[];
  count: number;
  pagination_token?: string;
}

function useUsersQuery(paginationToken?: string) {
  return useQuery<UsersResponse, Error>({
    queryKey: ["users", paginationToken],
    queryFn: async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) {
        throw new Error("No auth token found");
      }

      const url = new URL("/api/users", window.location.origin);
      url.searchParams.set("limit", "15");
      if (paginationToken) {
        url.searchParams.set("pagination_token", paginationToken);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
  });
}

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paginationToken, setPaginationToken] = useState<string | undefined>();

  const { data, isLoading, refetch, isFetching } = useUsersQuery(paginationToken);

  const users = data?.users || [];
  const hasMorePages = !!data?.pagination_token;

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      roleFilter === "all" ||
      userRoles.find((role) => role.value === roleFilter)?.value ===
        u.user_role;
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
    const user: Partial<User> = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      user_role: form.role,
      agency_id: form.agency,
    };
    console.log(user);
  }

  function handleEditUser(form: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    agency: string;
  }) {
    if (!selectedUser) return;

    const updatedUser: Partial<User> = {
      name: form.firstName + " " + form.lastName,
      email: form.email,
      user_role: form.role,
      agency_id: form.agency,
    };

    console.log(updatedUser);
  }

  function handleDeleteUser() {
    if (!selectedUser) return;
    console.log(selectedUser);
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
            Manage users and their permissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPaginationToken(undefined);
              refetch();
            }}
            disabled={isFetching}
          >
            <RefreshCcw
              className={cn("h-4 w-4 mr-2", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
          <Button onClick={() => setAddDialogOpen(true)}>Add User</Button>
        </div>
      </div>

      <div className="px-4 sm:px-6">
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          userRoles={userRoles}
          paginationToken={paginationToken}
          onPaginationChange={setPaginationToken}
          hasMorePages={hasMorePages}
          nextPageToken={data?.pagination_token}
        />
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddUser}
        agencies={agencies}
        userRoles={userRoles}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleEditUser}
        user={selectedUser}
        agencies={agencies}
        userRoles={userRoles}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
}
