import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as attendanceRepo from "@/features/attendance/repositories/attendance-repository";
import { formatDateOnly, todayDateString } from "@/lib/date";
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
