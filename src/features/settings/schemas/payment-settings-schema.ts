import { z } from "zod";

export const paymentSettingsSchema = z.object({
  businessName: z.string().min(1, "Business name is required").max(100),
  upiId: z
    .string()
    .min(1, "UPI ID is required")
    .regex(/^[\w.+-]+@[\w.-]+$/, "Enter a valid UPI ID, e.g. yourname@upi"),
});
export type PaymentSettingsInput = z.infer<typeof paymentSettingsSchema>;
