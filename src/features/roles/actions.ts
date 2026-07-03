"use server";

import { revalidatePath } from "next/cache";
import * as roleService from "@/features/roles/services/role-service";
import { roleSchema } from "@/features/roles/schemas/role-schema";
import type { RoleInput } from "@/features/roles/schemas/role-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getRolesAction() {
  return roleService.listRoles();
}

export async function createRoleAction(input: RoleInput) {
  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await roleService.createRole(parsed.data);
    revalidatePath("/users/roles");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function updateRoleAction(id: string, input: RoleInput) {
  const parsed = roleSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await roleService.updateRole(id, parsed.data);
    revalidatePath("/users/roles");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}

export async function deleteRoleAction(id: string) {
  try {
    await roleService.deleteRole(id);
    revalidatePath("/users/roles");
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
