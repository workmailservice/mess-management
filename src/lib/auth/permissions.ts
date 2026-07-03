import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import type { PermissionKey } from "@/constants/permissions";

/** Deduped per request via React's cache() — safe to call from many components. */
export const getCurrentSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export const getCurrentUserPermissions = cache(async (): Promise<Set<PermissionKey>> => {
  const session = await getCurrentSession();
  if (!session?.user) return new Set();

  const role = await prisma.role.findUnique({
    where: { id: session.user.roleId },
    select: { permissions: { select: { permission: { select: { key: true } } } } },
  });

  return new Set((role?.permissions.map((rp) => rp.permission.key) ?? []) as PermissionKey[]);
});

export class ForbiddenError extends Error {
  constructor(public readonly permission: PermissionKey) {
    super(`Missing required permission: ${permission}`);
    this.name = "ForbiddenError";
  }
}

/** Throws ForbiddenError if the current user lacks `permission`. Call at the top of every Service method and Route Handler — never trust client-side UI gating alone. */
export async function requirePermission(permission: PermissionKey) {
  const permissions = await getCurrentUserPermissions();
  if (!permissions.has(permission)) {
    throw new ForbiddenError(permission);
  }
}

export async function hasPermission(permission: PermissionKey) {
  const permissions = await getCurrentUserPermissions();
  return permissions.has(permission);
}
