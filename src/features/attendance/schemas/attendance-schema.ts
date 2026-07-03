import { z } from "zod";

export const mealTypeSchema = z.enum(["BREAKFAST", "LUNCH", "DINNER"]);
export const attendanceStatusSchema = z.enum(["TAKEN", "SKIPPED"]);

export const setAttendanceSchema = z.object({
  customerId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  mealType: mealTypeSchema,
  status: attendanceStatusSchema,
});
export type SetAttendanceInput = z.infer<typeof setAttendanceSchema>;
