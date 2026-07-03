"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { useRoles, useDeleteRole } from "@/features/roles/hooks/use-roles";
import { buildRoleColumns, type RoleRow } from "@/features/roles/components/columns";
import { RoleFormDialog } from "@/features/roles/components/role-form-dialog";

export function RolesView() {
  const { data, isLoading, isError, refetch } = useRoles();
  const deleteRole = useDeleteRole();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleRow | null>(null);

  const rows: RoleRow[] = useMemo(
    () =>
      (data ?? []).map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        userCount: role._count.users,
        permissionKeys: role.permissions.map((p) => p.permission.key),
      })),
    [data],
  );

  const columns = useMemo(
    () =>
      buildRoleColumns(
        (role) => {
          setEditingRole(role);
          setFormOpen(true);
        },
        (role) => setDeletingRole(role),
      ),
    [],
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={rows}
        searchColumn="name"
        searchPlaceholder="Search roles..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No roles"
        emptyDescription="Create a custom role to grant a specific set of permissions."
        toolbar={
          <Button
            onClick={() => {
              setEditingRole(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            New role
          </Button>
        }
      />

      <RoleFormDialog open={formOpen} onOpenChange={setFormOpen} role={editingRole} />

      <AlertDialog open={!!deletingRole} onOpenChange={(open) => !open && setDeletingRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role &quot;{deletingRole?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Users with this role are not deleted, but the role must have no assigned users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingRole) deleteRole.mutate(deletingRole.id);
                setDeletingRole(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
