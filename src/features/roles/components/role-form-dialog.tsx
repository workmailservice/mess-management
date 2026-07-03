"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PERMISSIONS } from "@/constants/permissions";
import { useCreateRole, useUpdateRole } from "@/features/roles/hooks/use-roles";
import { roleSchema, type RoleInput } from "@/features/roles/schemas/role-schema";
import type { RoleRow } from "@/features/roles/components/columns";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: RoleRow | null;
}

function moduleLabel(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");
}

function permissionLabel(key: string) {
  const action = key.split(".")[1] ?? key;
  return action.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function RoleFormDialog({ open, onOpenChange, role }: RoleFormDialogProps) {
  const isEdit = !!role;
  const isSystem = !!role?.isSystem;
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const pending = createRole.isPending || updateRole.isPending;

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "", description: "", permissionKeys: [] },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      name: role?.name ?? "",
      description: role?.description ?? "",
      permissionKeys: role?.permissionKeys ?? [],
    });
  }, [open, role, reset]);

  async function onSubmit(values: RoleInput) {
    const result = isEdit ? await updateRole.mutateAsync({ id: role.id, input: values }) : await createRole.mutateAsync(values);
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit role" : "New role"}</DialogTitle>
          <DialogDescription>
            {isSystem
              ? "System roles cannot be renamed or deleted, but their permissions can be adjusted."
              : "Custom roles can be freely renamed, adjusted, or deleted."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="role-name">Name</FieldLabel>
              <Input id="role-name" disabled={isSystem} {...register("name")} />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="role-description">Description</FieldLabel>
              <Textarea id="role-description" disabled={isSystem} rows={2} {...register("description")} />
            </Field>

            <Field>
              <FieldLabel>Permissions</FieldLabel>
              <ScrollArea className="h-72 rounded-md border p-4">
                <Controller
                  control={control}
                  name="permissionKeys"
                  render={({ field }) => (
                    <div className="space-y-4">
                      {Object.entries(PERMISSIONS).map(([moduleKey, permissions]) => (
                        <div key={moduleKey} className="space-y-2">
                          <p className="text-sm font-medium">{moduleLabel(moduleKey)}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.values(permissions).map((permissionKey) => (
                              <label key={permissionKey} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                  checked={field.value.includes(permissionKey)}
                                  onCheckedChange={(checked) => {
                                    field.onChange(
                                      checked
                                        ? [...field.value, permissionKey]
                                        : field.value.filter((k) => k !== permissionKey),
                                    );
                                  }}
                                />
                                {permissionLabel(permissionKey)}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </ScrollArea>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
