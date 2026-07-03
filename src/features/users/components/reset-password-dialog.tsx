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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/forms/password-input";
import { generateSecurePassword } from "@/lib/utils";
import { useResetUserPassword } from "@/features/users/hooks/use-users";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/users/schemas/user-schema";
import type { UserRow } from "@/features/users/components/columns";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserRow | null;
}

export function ResetPasswordDialog({ open, onOpenChange, user }: ResetPasswordDialogProps) {
  const resetPassword = useResetUserPassword();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (open) reset({ password: generateSecurePassword() });
  }, [open, reset]);

  async function onSubmit(values: ResetPasswordInput) {
    if (!user) return;
    const result = await resetPassword.mutateAsync({ id: user.id, input: values });
    if (result.success) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a new password for {user?.name}. They will be signed out of all devices and must sign in again with
            this password.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="reset-password">New password</FieldLabel>
              <div className="flex gap-2">
                <PasswordInput id="reset-password" {...register("password")} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Generate a new password"
                  onClick={() => setValue("password", generateSecurePassword(), { shouldValidate: true })}
                >
                  <Dices className="size-4" />
                </Button>
              </div>
              <FieldError errors={[errors.password]} />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={resetPassword.isPending}>
              {resetPassword.isPending && <Loader2 className="size-4 animate-spin" />}
              Reset password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
