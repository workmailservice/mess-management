"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/forms/password-input";
import { authClient } from "@/lib/auth/auth-client";
import { changePasswordSchema, type ChangePasswordInput } from "@/features/profile/schemas/profile-schema";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  async function onSubmit(values: ChangePasswordInput) {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error(error.message ?? "Failed to change password.");
      return;
    }
    toast.success("Password changed. You've been signed out of other devices.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.currentPassword}>
          <FieldLabel htmlFor="current-password">Current password</FieldLabel>
          <PasswordInput id="current-password" autoComplete="current-password" {...register("currentPassword")} />
          <FieldError errors={[errors.currentPassword]} />
        </Field>

        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="new-password">New password</FieldLabel>
          <PasswordInput id="new-password" autoComplete="new-password" {...register("newPassword")} />
          <FieldError errors={[errors.newPassword]} />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
          <PasswordInput id="confirm-password" autoComplete="new-password" {...register("confirmPassword")} />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Change password
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
