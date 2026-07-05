import { z } from "zod";

export const logReminderSchema = z.object({
  customerId: z.string().min(1),
  invoiceId: z.string().min(1),
  message: z.string().min(1),
});
export type LogReminderInput = z.infer<typeof logReminderSchema>;
