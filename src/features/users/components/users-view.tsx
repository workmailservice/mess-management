"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/data-table";
import { useUsers } from "@/features/users/hooks/use-users";
import { buildUserColumns, type UserRow } from "@/features/users/components/columns";
import { UserFormDialog } from "@/features/users/components/user-form-dialog";
import { ResetPasswordDialog } from "@/features/users/components/reset-password-dialog";

export function UsersView() {
  const { data, isLoading, isError, refetch } = useUsers();
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserRow | null>(null);

  const columns = useMemo(
    () =>
      buildUserColumns(
        (user) => {
          setEditingUser(user);
          setFormOpen(true);
        },
        (user) => setResetPasswordUser(user),
      ),
    [],
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data ?? []}
        searchColumn="name"
        searchPlaceholder="Search by name..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No users yet"
        emptyDescription="Create the first staff or student account to get started."
        toolbar={
          <Button
            onClick={() => {
              setEditingUser(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            New user
          </Button>
        }
      />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editingUser} />
      <ResetPasswordDialog
        open={!!resetPasswordUser}
        onOpenChange={(open) => !open && setResetPasswordUser(null)}
        user={resetPasswordUser}
      />
    </div>
  );
}
