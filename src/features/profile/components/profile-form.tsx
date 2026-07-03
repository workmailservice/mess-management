"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth/auth-client";
import { updateProfileSchema, type UpdateProfileInput } from "@/features/profile/schemas/profile-schema";

interface ProfileFormProps {
  defaultValues: { name: string; phone: string };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({ resolver: zodResolver(updateProfileSchema), defaultValues });

  async function onSubmit(values: UpdateProfileInput) {
    const { error } = await authClient.updateUser({ name: values.name, phone: values.phone || "" });
    if (error) {
      toast.error(error.message ?? "Failed to update profile.");
      return;
    }
    toast.success("Profile updated.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="profile-name">Name</FieldLabel>
          <Input id="profile-name" {...register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
          <Input id="profile-phone" {...register("phone")} />
        </Field>

        <div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
