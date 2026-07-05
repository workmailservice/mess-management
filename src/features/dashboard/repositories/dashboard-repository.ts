import { prisma } from "@/lib/prisma";

export function countActiveCustomers() {
  return prisma.customer.count({ where: { deletedAt: null, status: "ACTIVE" } });
}

export function findRecentPayments(limit: number) {
  return prisma.payment.findMany({
    orderBy: { paidAt: "desc" },
    take: limit,
    include: { customer: { select: { id: true, name: true } } },
  });
}

export function findRecentExpenses(limit: number) {
  return prisma.expense.findMany({
    orderBy: { date: "desc" },
    take: limit,
    include: { category: { select: { name: true } } },
  });
}

export async function sumOutstandingBalance() {
  const invoices = await prisma.invoice.findMany({
    where: { status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } },
    select: { amount: true, payments: { select: { amount: true } } },
  });

  return invoices.reduce((sum, invoice) => {
    const paid = invoice.payments.reduce((s, p) => s + Number(p.amount), 0);
    return sum + (Number(invoice.amount) - paid);
  }, 0);
}

export async function findRecentAuditLogs(limit: number) {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const userIds = [...new Set(logs.map((log) => log.userId).filter((id): id is string => !!id))];
  const users = userIds.length
    ? await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
    : [];
  const userNameById = new Map(users.map((user) => [user.id, user.name]));

  return logs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entityType,
    userName: (log.userId && userNameById.get(log.userId)) || "System",
    createdAt: log.createdAt,
  }));
}
