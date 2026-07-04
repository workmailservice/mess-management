import { z } from "zod";

export const incomeSchema = z.object({
  categoryId: z.string().min(1, "Select a category"),
  amount: z.number({ error: "Amount is required" }).positive("Amount must be greater than 0"),
  source: z.string().max(100).optional().or(z.literal("")),
  description: z.string().max(300).optional().or(z.literal("")),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});
export type IncomeInput = z.infer<typeof incomeSchema>;

export const categoryNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
});
export type CategoryNameInput = z.infer<typeof categoryNameSchema>;
