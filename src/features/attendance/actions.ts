"use server";

import * as attendanceService from "@/features/attendance/services/attendance-service";
import { setAttendanceSchema } from "@/features/attendance/schemas/attendance-schema";
import type { SetAttendanceInput } from "@/features/attendance/schemas/attendance-schema";

function actionError(err: unknown) {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function getAttendanceForDateAction(date: string) {
  return attendanceService.getAttendanceForDate(date);
}

export async function setAttendanceAction(input: SetAttendanceInput) {
  const parsed = setAttendanceSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    await attendanceService.setAttendance(parsed.data);
    return { success: true as const };
  } catch (err) {
    return { success: false as const, error: actionError(err) };
  }
}
