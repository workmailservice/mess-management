import { prisma } from "@/lib/prisma";

export function findManyRoles() {
  return prisma.role.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      isSystem: true,
      _count: { select: { users: true } },
      permissions: { select: { permission: { select: { key: true } } } },
    },
  });
}

export function findRoleById(id: string) {
  return prisma.role.findUnique({
    where: { id },
    select: { id: true, name: true, description: true, isSystem: true },
  });
}

export function countUsersWithRole(roleId: string) {
  return prisma.user.count({ where: { roleId } });
}

export async function createRole(data: { name: string; description: string | null; permissionKeys: string[] }) {
  const permissions = await prisma.permission.findMany({ where: { key: { in: data.permissionKeys } }, select: { id: true } });

  return prisma.role.create({
    data: {
      name: data.name,
      description: data.description,
      isSystem: false,
      permissions: { create: permissions.map((p) => ({ permissionId: p.id })) },
    },
  });
}

export async function updateRole(
  id: string,
  data: { name?: string; description?: string | null; permissionKeys: string[] },
) {
  const permissions = await prisma.permission.findMany({ where: { key: { in: data.permissionKeys } }, select: { id: true } });

  return prisma.$transaction([
    prisma.role.update({
      where: { id },
      data: data.name !== undefined ? { name: data.name, description: data.description } : {},
    }),
    prisma.rolePermission.deleteMany({ where: { roleId: id } }),
    prisma.rolePermission.createMany({
      data: permissions.map((p) => ({ roleId: id, permissionId: p.id })),
    }),
  ]);
}

export function deleteRole(id: string) {
  return prisma.role.delete({ where: { id } });
}
