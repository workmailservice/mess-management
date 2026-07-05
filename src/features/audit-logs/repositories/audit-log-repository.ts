import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";
import type { Prisma } from "@/generated/prisma";
import type { AuditLogFilters } from "@/features/audit-logs/schemas/audit-log-schema";

const RESULT_LIMIT = 500;

export async function findManyAuditLogs(filters: AuditLogFilters) {
  const where: Prisma.AuditLogWhereInput = {};
  if (filters.entityType) where.entityType = filters.entityType;
  if (filters.action) where.action = filters.action;
  if (filters.fromDate || filters.toDate) {
    where.createdAt = {};
    if (filters.fromDate) where.createdAt.gte = parseDateOnly(filters.fromDate);
    if (filters.toDate) where.createdAt.lte = new Date(parseDateOnly(filters.toDate).getTime() + 24 * 60 * 60 * 1000 - 1);
  }

  const logs = await prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, take: RESULT_LIMIT });

  const userIds = [...new Set(logs.map((log) => log.userId).filter((id): id is string => !!id))];
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
    : [];
  const userNameById = new Map(users.map((user) => [user.id, user.name]));

  return logs.map((log) => ({
    ...log,
    userName: (log.userId && userNameById.get(log.userId)) || "System",
  }));
}

export async function findDistinctEntityTypes() {
  const rows = await prisma.auditLog.findMany({ distinct: ["entityType"], select: { entityType: true }, orderBy: { entityType: "asc" } });
  return rows.map((row) => row.entityType);
}
