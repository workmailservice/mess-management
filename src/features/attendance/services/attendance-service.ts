import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as attendanceRepo from "@/features/attendance/repositories/attendance-repository";
import * as customerRepo from "@/features/customers/repositories/customer-repository";
import { formatDateOnly, todayDateString, daysInMonth, dateStringForDay } from "@/lib/date";
import type { SetAttendanceInput } from "@/features/attendance/schemas/attendance-schema";

export async function getAttendanceForMonth(year: number, month: number) {
  await requirePermission(PERMISSIONS.attendance.view);

  const [customers, records] = await Promise.all([
    attendanceRepo.findActiveCustomersForAttendance(),
    attendanceRepo.findAttendanceForMonth(year, month),
  ]);

  return {
    customers,
    records: records.map((record) => ({
      customerId: record.customerId,
      date: formatDateOnly(record.date),
      count: record.count,
    })),
  };
}

export async function getCustomerAttendanceReport(customerId: string, year: number, month: number) {
  await requirePermission(PERMISSIONS.attendance.view);

  const [customer, records] = await Promise.all([
    customerRepo.findCustomerById(customerId),
    attendanceRepo.findAttendanceForCustomerMonth(customerId, year, month),
  ]);

  if (!customer) throw new Error("Customer not found.");

  const countByDate = new Map<string, number>();
  for (const record of records) countByDate.set(formatDateOnly(record.date), record.count);

  const dayCount = daysInMonth(year, month);
  let daysTaken = 0;
  let daysNotTaken = 0;
  let totalTiffins = 0;

  const days = Array.from({ length: dayCount }, (_, index) => {
    const day = index + 1;
    const date = dateStringForDay(year, month, day);
    const count = countByDate.get(date) ?? 0;
    const taken = count > 0;
    if (taken) daysTaken++;
    else daysNotTaken++;
    totalTiffins += count;
    return { day, date, count, taken };
  });

  return {
    customer: { id: customer.id, name: customer.name, phone: customer.phone },
    year,
    month,
    days,
    summary: { daysTaken, daysNotTaken, totalTiffins, dayCount },
  };
}

export async function setAttendance(input: SetAttendanceInput) {
  await requirePermission(PERMISSIONS.attendance.mark);

  if (input.date > todayDateString()) {
    throw new Error("Cannot record attendance for a future date.");
  }

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  // Routine operational data — its own row (markedById + updatedAt) is the
  // audit trail; a formal AuditLog entry per edit would just be noise.
  return attendanceRepo.upsertAttendance({ ...input, markedById: session.user.id });
}
