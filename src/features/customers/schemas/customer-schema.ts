import { z } from "zod";

const phoneSchema = z
  .string()
  .min(1, "Phone is required")
  .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number, e.g. +91 98765 43210");

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: phoneSchema,
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  monthlyRate: z
    .number({ error: "Monthly rate is required" })
    .positive("Monthly rate must be greater than 0"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
export type CustomerInput = z.infer<typeof customerSchema>;
