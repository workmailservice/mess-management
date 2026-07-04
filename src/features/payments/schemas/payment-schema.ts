import { z } from "zod";

export const recordPaymentSchema = z.object({
  customerId: z.string().min(1, "Select a customer"),
  invoiceId: z.string().optional(),
  amount: z.number({ error: "Amount is required" }).positive("Amount must be greater than 0"),
  method: z.enum(["CASH", "UPI", "BANK_TRANSFER", "CARD", "ONLINE"]),
  transactionRef: z.string().max(100).optional().or(z.literal("")),
});
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
