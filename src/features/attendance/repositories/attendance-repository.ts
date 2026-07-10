import { prisma } from "@/lib/prisma";
import { parseDateOnly, dateStringForDay, daysInMonth } from "@/lib/date";

export function findActiveCustomersForAttendance() {
  return prisma.customer.findMany({
    where: { deletedAt: null, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true },
  });
}

export function findAttendanceForMonth(year: number, month: number) {
  const from = parseDateOnly(dateStringForDay(year, month, 1));
  const to = parseDateOnly(dateStringForDay(year, month, daysInMonth(year, month)));
  return prisma.attendance.findMany({
    where: { date: { gte: from, lte: to } },
    select: { customerId: true, date: true, count: true },
  });
}

export function upsertAttendance(input: { customerId: string; date: string; count: number; markedById: string }) {
  const date = parseDateOnly(input.date);
  return prisma.attendance.upsert({
    where: { customerId_date: { customerId: input.customerId, date } },
    update: { count: input.count, markedById: input.markedById },
    create: { customerId: input.customerId, date, count: input.count, markedById: input.markedById },
  });
}
