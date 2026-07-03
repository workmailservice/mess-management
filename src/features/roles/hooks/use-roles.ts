"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getRolesAction, createRoleAction, updateRoleAction, deleteRoleAction } from "@/features/roles/actions";
import type { RoleInput } from "@/features/roles/schemas/role-schema";

const ROLES_QUERY_KEY = ["roles"];

export function useRoles() {
  return useQuery({ queryKey: ROLES_QUERY_KEY, queryFn: getRolesAction });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RoleInput) => createRoleAction(input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Role created.");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: RoleInput }) => updateRoleAction(id, input),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Role updated.");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRoleAction(id),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success("Role deleted.");
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
    },
  });
}
