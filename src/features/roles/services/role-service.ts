import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as roleRepo from "@/features/roles/repositories/role-repository";
import type { RoleInput } from "@/features/roles/schemas/role-schema";

export async function listRoles() {
  await requirePermission(PERMISSIONS.roles.view);
  return roleRepo.findManyRoles();
}

export async function createRole(input: RoleInput) {
  await requirePermission(PERMISSIONS.roles.manage);

  const role = await roleRepo.createRole({
    name: input.name,
    description: input.description || null,
    permissionKeys: input.permissionKeys,
  });

  await logAudit({ action: "CREATE", entityType: "Role", entityId: role.id, after: { name: input.name, permissionKeys: input.permissionKeys } });
  return role;
}

export async function updateRole(id: string, input: RoleInput) {
  await requirePermission(PERMISSIONS.roles.manage);

  const existing = await roleRepo.findRoleById(id);
  if (!existing) throw new Error("Role not found.");
  if (existing.isSystem && existing.name !== input.name) {
    throw new Error("System role names cannot be changed.");
  }

  await roleRepo.updateRole(id, {
    name: existing.isSystem ? undefined : input.name,
    description: existing.isSystem ? undefined : input.description || null,
    permissionKeys: input.permissionKeys,
  });

  await logAudit({ action: "UPDATE", entityType: "Role", entityId: id, after: { permissionKeys: input.permissionKeys } });
}

export async function deleteRole(id: string) {
  await requirePermission(PERMISSIONS.roles.manage);

  const existing = await roleRepo.findRoleById(id);
  if (!existing) throw new Error("Role not found.");
  if (existing.isSystem) throw new Error("System roles cannot be deleted.");

  const usersWithRole = await roleRepo.countUsersWithRole(id);
  if (usersWithRole > 0) {
    throw new Error(`Cannot delete a role assigned to ${usersWithRole} user(s). Reassign them first.`);
  }

  await roleRepo.deleteRole(id);
  await logAudit({ action: "DELETE", entityType: "Role", entityId: id });
}
