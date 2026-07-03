"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dices, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PasswordInput } from "@/components/forms/password-input";
import { generateSecurePassword } from "@/lib/utils";
import { useCreateUser, useUpdateUser } from "@/features/users/hooks/use-users";
import { useRoles } from "@/features/roles/hooks/use-roles";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "@/features/users/schemas/user-schema";
import type { UserRow } from "@/features/users/components/columns";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserRow | null;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = !!user;
  const { data: roles } = useRoles();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const pending = createUser.isPending || updateUser.isPending;

  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "", phone: "", roleId: "", password: "" },
  });
  const editForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: "", phone: "", roleId: "", status: "ACTIVE" },
  });

  useEffect(() => {
    if (!open) return;
    if (isEdit && user) {
      editForm.reset({ name: user.name, phone: user.phone ?? "", roleId: user.role.id, status: user.status });
    } else {
      createForm.reset({ name: "", email: "", phone: "", roleId: "", password: generateSecurePassword() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, user]);

  async function onCreateSubmit(values: CreateUserInput) {
    const result = await createUser.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  async function onEditSubmit(values: UpdateUserInput) {
    if (!user) return;
    const result = await updateUser.mutateAsync({ id: user.id, input: values });
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit user" : "Create user"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update this user's details, role, and status."
              : "Set an initial password and share it with the user directly — there is no email invite flow."}
          </DialogDescription>
        </DialogHeader>

        {isEdit ? (
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!editForm.formState.errors.name}>
                <FieldLabel htmlFor="edit-name">Name</FieldLabel>
                <Input id="edit-name" {...editForm.register("name")} />
                <FieldError errors={[editForm.formState.errors.name]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-phone">Phone</FieldLabel>
                <Input id="edit-phone" {...editForm.register("phone")} />
              </Field>

              <Field data-invalid={!!editForm.formState.errors.roleId}>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={editForm.watch("roleId")}
                  onValueChange={(value) => value && editForm.setValue("roleId", value, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[editForm.formState.errors.roleId]} />
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  value={editForm.watch("status")}
                  onValueChange={(value) => value && editForm.setValue("status", value as UpdateUserInput["status"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!createForm.formState.errors.name}>
                <FieldLabel htmlFor="create-name">Name</FieldLabel>
                <Input id="create-name" {...createForm.register("name")} />
                <FieldError errors={[createForm.formState.errors.name]} />
              </Field>

              <Field data-invalid={!!createForm.formState.errors.email}>
                <FieldLabel htmlFor="create-email">Email</FieldLabel>
                <Input id="create-email" type="email" {...createForm.register("email")} />
                <FieldError errors={[createForm.formState.errors.email]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="create-phone">Phone</FieldLabel>
                <Input id="create-phone" {...createForm.register("phone")} />
              </Field>

              <Field data-invalid={!!createForm.formState.errors.roleId}>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={createForm.watch("roleId")}
                  onValueChange={(value) => value && createForm.setValue("roleId", value, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[createForm.formState.errors.roleId]} />
              </Field>

              <Field data-invalid={!!createForm.formState.errors.password}>
                <FieldLabel htmlFor="create-password">Initial password</FieldLabel>
                <div className="flex gap-2">
                  <PasswordInput id="create-password" {...createForm.register("password")} />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Generate a new password"
                    onClick={() => createForm.setValue("password", generateSecurePassword(), { shouldValidate: true })}
                  >
                    <Dices className="size-4" />
                  </Button>
                </div>
                <FieldError errors={[createForm.formState.errors.password]} />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                Create user
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
