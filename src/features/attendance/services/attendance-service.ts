import "server-only";
import { requirePermission, getCurrentSession } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/constants/permissions";
import * as attendanceRepo from "@/features/attendance/repositories/attendance-repository";
import type { SetAttendanceInput } from "@/features/attendance/schemas/attendance-schema";

export async function getAttendanceForDate(date: string) {
  await requirePermission(PERMISSIONS.attendance.view);

  const [customers, records] = await Promise.all([
    attendanceRepo.findActiveCustomersForAttendance(),
    attendanceRepo.findAttendanceForDate(date),
  ]);

  return { customers, records };
}

export async function setAttendance(input: SetAttendanceInput) {
  await requirePermission(PERMISSIONS.attendance.mark);

  const session = await getCurrentSession();
  if (!session?.user) throw new Error("Not authenticated.");

  // Routine operational data — its own row (markedById + createdAt) is the
  // audit trail; a formal AuditLog entry per toggle would just be noise.
  return attendanceRepo.upsertAttendance({ ...input, markedById: session.user.id });
}
