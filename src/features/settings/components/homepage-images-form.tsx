"use client";

import { useRef, useState } from "react";
import { Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useBusinessProfile, useUploadBusinessImage } from "@/features/settings/hooks/use-business-profile";

function ImageUploadField({
  kind,
  label,
  description,
  currentUrl,
}: {
  kind: "hero" | "about";
  label: string;
  description: string;
  currentUrl: string | undefined;
}) {
  const uploadImage = useUploadBusinessImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  function handleUpload() {
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("kind", kind);
    formData.set("file", file);
    uploadImage.mutate(formData, {
      onSuccess: (result) => {
        if (result.success && inputRef.current) {
          inputRef.current.value = "";
          setSelectedName(null);
        }
      },
    });
  }

  return (
    <Field>
      <FieldLabel htmlFor={`${kind}-image`}>{label}</FieldLabel>
      <div className="flex items-center gap-4">
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- local upload preview, not a next/image optimization candidate
            <img src={currentUrl} alt={label} className="size-full object-cover" />
          ) : (
            <ImageOff className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Input
            id={`${kind}-image`}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={inputRef}
            onChange={(e) => setSelectedName(e.target.files?.[0]?.name ?? null)}
          />
          <Button type="button" size="sm" disabled={!selectedName || uploadImage.isPending} onClick={handleUpload}>
            {uploadImage.isPending && <Loader2 className="size-4 animate-spin" />}
            Upload
          </Button>
        </div>
      </div>
      <FieldDescription>{description}</FieldDescription>
    </Field>
  );
}

export function HomepageImagesForm() {
  const { data, isLoading } = useBusinessProfile();

  if (isLoading) return null;

  return (
    <div className="space-y-6">
      <ImageUploadField
        kind="hero"
        label="Hero photo"
        description="Shown beside your tagline at the top of the homepage. JPEG, PNG, or WebP, up to 5MB."
        currentUrl={data?.heroImageUrl}
      />
      <ImageUploadField
        kind="about"
        label="About photo"
        description="Shown alongside the About section on the homepage."
        currentUrl={data?.aboutImageUrl}
      />
    </div>
  );
}
