"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUsersAction, createUserAction, updateUserAction, resetUserPasswordAction } from "@/features/users/actions";
import type { CreateUserInput, UpdateUserInput, ResetPasswordInput } from "@/features/users/schemas/user-schema";

const USERS_QUERY_KEY = ["users"];

export function useUsers() {
  return useQuery({ queryKey: USERS_QUERY_KEY, queryFn: getUsersAction });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUserAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("User created.");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => updateUserAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("User updated.");
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useResetUserPassword() {
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ResetPasswordInput }) => resetUserPasswordAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Password reset. The user has been signed out everywhere.");
    },
  });
}
