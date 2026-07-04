import { z } from "zod";

export const generateInvoicesSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid due date"),
});
export type GenerateInvoicesInput = z.infer<typeof generateInvoicesSchema>;
