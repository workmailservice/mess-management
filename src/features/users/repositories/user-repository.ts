import { prisma } from "@/lib/prisma";

export function findManyUsers() {
  return prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      image: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
    },
  });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      roleId: true,
    },
  });
}

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: { id: true } });
}

export function updateUserProfile(
  id: string,
  data: { name: string; phone: string | null; roleId: string; status: "ACTIVE" | "INACTIVE" | "SUSPENDED" },
) {
  return prisma.user.update({ where: { id }, data });
}

export function assignInitialRole(id: string, roleId: string) {
  return prisma.user.update({ where: { id }, data: { roleId, status: "ACTIVE" } });
}
