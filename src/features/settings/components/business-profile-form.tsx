"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useBusinessProfile, useUpdateBusinessProfile } from "@/features/settings/hooks/use-business-profile";
import { businessProfileSchema, type BusinessProfileInput } from "@/features/settings/schemas/business-profile-schema";
import { BUSINESS_PROFILE_DEFAULTS } from "@/features/settings/lib/business-profile-defaults";

export function BusinessProfileForm() {
  const { data, isLoading } = useBusinessProfile();
  const updateProfile = useUpdateBusinessProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: BUSINESS_PROFILE_DEFAULTS,
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  if (isLoading) return null;

  return (
    <form onSubmit={handleSubmit((values) => updateProfile.mutate(values))} noValidate>
      <FieldGroup>
        {!data && (
          <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
            This form is pre-filled with placeholder content so the homepage isn&apos;t blank — replace it with your
            real details and save.
          </p>
        )}

        <Field data-invalid={!!errors.tagline}>
          <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
          <Input id="tagline" {...register("tagline")} />
          <FieldDescription>The short line shown under your business name on the homepage.</FieldDescription>
          <FieldError errors={[errors.tagline]} />
        </Field>

        <Field data-invalid={!!errors.aboutText}>
          <FieldLabel htmlFor="about-text">About</FieldLabel>
          <Textarea id="about-text" rows={4} {...register("aboutText")} />
          <FieldError errors={[errors.aboutText]} />
        </Field>

        <Field data-invalid={!!errors.rateDisplay}>
          <FieldLabel htmlFor="rate-display">Rate</FieldLabel>
          <Input id="rate-display" {...register("rateDisplay")} />
          <FieldDescription>Free text — shown as-is, e.g. &quot;₹3,000 / month&quot;.</FieldDescription>
          <FieldError errors={[errors.rateDisplay]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="meal-timings">Meal timings (optional)</FieldLabel>
          <Input id="meal-timings" {...register("mealTimings")} />
        </Field>

        <Field data-invalid={!!errors.address}>
          <FieldLabel htmlFor="address">Address</FieldLabel>
          <Textarea id="address" rows={2} {...register("address")} />
          <FieldError errors={[errors.address]} />
        </Field>

        <Field data-invalid={!!errors.phone}>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <Input id="phone" {...register("phone")} />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="public-email">Email (optional)</FieldLabel>
          <Input id="public-email" type="email" {...register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>

        <div>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
