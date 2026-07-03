import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";
import type { MealType, AttendanceStatus } from "@/generated/prisma";

export function findActiveCustomersForAttendance() {
  return prisma.customer.findMany({
    where: { deletedAt: null, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true },
  });
}

export function findAttendanceForDate(date: string) {
  return prisma.attendance.findMany({
    where: { date: parseDateOnly(date) },
    select: { customerId: true, mealType: true, status: true },
  });
}

export function upsertAttendance(input: {
  customerId: string;
  date: string;
  mealType: MealType;
  status: AttendanceStatus;
  markedById: string;
}) {
  const date = parseDateOnly(input.date);
  return prisma.attendance.upsert({
    where: { customerId_date_mealType: { customerId: input.customerId, date, mealType: input.mealType } },
    update: { status: input.status, markedById: input.markedById },
    create: {
      customerId: input.customerId,
      date,
      mealType: input.mealType,
      status: input.status,
      markedById: input.markedById,
    },
  });
}
