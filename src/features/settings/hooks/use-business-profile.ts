"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getBusinessProfileAction, updateBusinessProfileAction, uploadBusinessImageAction } from "@/features/settings/actions";
import type { BusinessProfileInput } from "@/features/settings/schemas/business-profile-schema";

const BUSINESS_PROFILE_QUERY_KEY = ["business-profile"];

export function useBusinessProfile() {
  return useQuery({ queryKey: BUSINESS_PROFILE_QUERY_KEY, queryFn: getBusinessProfileAction });
}

export function useUpdateBusinessProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BusinessProfileInput) => updateBusinessProfileAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Business profile saved.");
      queryClient.invalidateQueries({ queryKey: BUSINESS_PROFILE_QUERY_KEY });
    },
  });
}

export function useUploadBusinessImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => uploadBusinessImageAction(formData),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Image uploaded.");
      queryClient.invalidateQueries({ queryKey: BUSINESS_PROFILE_QUERY_KEY });
    },
  });
}
