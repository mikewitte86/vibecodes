"use client";

import { useState, useMemo } from "react";
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
import { Row, ColumnDef } from "@tanstack/react-table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UsersResponse } from "@/types/api";
import { userApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const PER_PAGE = 15;

const userRoles = [
  { name: "Super Admin", value: USER_ROLES_TYPES.SUPER_ADMIN },
  { name: "Agency Admin", value: USER_ROLES_TYPES.AGENCY_ADMIN },
];

const agencies = [
  { name: "Equal Parts", value: AGENCY_TYPES.EQUAL_PARTS },
  { name: "Lumen", value: AGENCY_TYPES.LUMEN },
  { name: "Assurely", value: AGENCY_TYPES.ASSURELY },
];

export default function UserManagementPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch, isFetching } = useQuery<UsersResponse>({
    queryKey: ["users", page],
    queryFn: async () => {
      const response = await userApi.getUsers(page > 0 ? data?.pagination_token : undefined);
      return response;
    },
  });

  const hasMorePages = !!data?.pagination_token;

  const addUserMutation = useMutation({
    mutationFn: (form: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      agency: string;
    }) =>
      userApi.createUser({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        user_role: form.role,
        agency_id: form.agency,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setAddDialogOpen(false);
    },
  });

  const editUserMutation = useMutation({
    mutationFn: (form: {
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      agency: string;
    }) => {
      if (!selectedUser?.username) {
        throw new Error("No user selected");
      }
      return userApi.updateUser(selectedUser.username, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        user_role: form.role.toUpperCase(),
        agency_id: form.agency.toLowerCase(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditDialogOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser?.username) {
        throw new Error("No user selected");
      }
      return userApi.deleteUser(selectedUser.username);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteDialogOpen(false);
    },
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
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
    ],
    [],
  );

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
              setPage(0);
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
          data={data?.users || []}
          isLoading={isLoading}
          pagination={{
            pageIndex: page,
            pageSize: PER_PAGE,
            pageCount: hasMorePages ? page + 2 : page + 1,
            onPageChange: (newPage) => setPage(newPage),
          }}
        />
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addUserMutation.mutate}
        agencies={agencies}
        userRoles={userRoles}
        isSubmitting={addUserMutation.isPending}
        error={addUserMutation.error?.message || null}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={editUserMutation.mutate}
        user={selectedUser}
        agencies={agencies}
        userRoles={userRoles}
        isSubmitting={editUserMutation.isPending}
        error={editUserMutation.error?.message || null}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => deleteUserMutation.mutate()}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        isSubmitting={deleteUserMutation.isPending}
        error={deleteUserMutation.error?.message || null}
      />
    </div>
  );
}
