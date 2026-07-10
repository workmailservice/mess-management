import { z } from "zod";

export const setAttendanceSchema = z.object({
  customerId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  count: z.number().int().min(0, "Count cannot be negative"),
});
export type SetAttendanceInput = z.infer<typeof setAttendanceSchema>;
