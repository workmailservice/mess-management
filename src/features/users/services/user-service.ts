import "server-only";
import { headers } from "next/headers";
import { hashPassword } from "better-auth/crypto";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import {
  findManyUsers,
  findUserByEmail,
  findUserById,
  updateUserProfile,
} from "@/features/users/repositories/user-repository";
import type { CreateUserInput, UpdateUserInput } from "@/features/users/schemas/user-schema";

export async function listUsers() {
  await requirePermission(PERMISSIONS.users.view);
  return findManyUsers();
}

export async function createUser(input: CreateUserInput) {
  await requirePermission(PERMISSIONS.users.create);

  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new Error("A user with this email already exists.");
  }

  const requestHeaders = await headers();
  let created: Awaited<ReturnType<typeof auth.api.signUpEmail>>;
  try {
    created = await auth.api.signUpEmail({
      body: { name: input.name, email: input.email, password: input.password },
      headers: requestHeaders,
    });
  } catch (err) {
    throw new Error(err instanceof APIError ? err.message : "Failed to create user.");
  }

  const user = await updateUserProfile(created.user.id, {
    name: input.name,
    phone: input.phone || null,
    roleId: input.roleId,
    status: "ACTIVE",
  });

  await logAudit({ action: "CREATE", entityType: "User", entityId: user.id, after: { email: input.email, roleId: input.roleId } });

  return user;
}

export async function updateUser(id: string, input: UpdateUserInput) {
  await requirePermission(PERMISSIONS.users.update);

  const before = await findUserById(id);
  if (!before) throw new Error("User not found.");

  const user = await updateUserProfile(id, {
    name: input.name,
    phone: input.phone || null,
    roleId: input.roleId,
    status: input.status,
  });

  // A suspended/deactivated user shouldn't keep using an already-issued session cookie.
  if (input.status !== "ACTIVE" && before.status === "ACTIVE") {
    await prisma.session.deleteMany({ where: { userId: id } });
  }

  await logAudit({
    action: input.status !== before.status && input.status !== "ACTIVE" ? "DEACTIVATE" : "UPDATE",
    entityType: "User",
    entityId: id,
    before: { name: before.name, phone: before.phone, roleId: before.roleId, status: before.status },
    after: { name: input.name, phone: input.phone, roleId: input.roleId, status: input.status },
  });

  return user;
}

export async function resetUserPassword(id: string, newPassword: string) {
  await requirePermission(PERMISSIONS.users.update);

  const user = await findUserById(id);
  if (!user) throw new Error("User not found.");

  const hashed = await hashPassword(newPassword);
  await prisma.account.updateMany({
    where: { userId: id, providerId: "credential" },
    data: { password: hashed },
  });
  // Force re-authentication with the new password.
  await prisma.session.deleteMany({ where: { userId: id } });

  await logAudit({ action: "PASSWORD_RESET", entityType: "User", entityId: id });
}
