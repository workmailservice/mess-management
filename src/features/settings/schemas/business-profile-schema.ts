import { z } from "zod";

export const businessProfileSchema = z.object({
  tagline: z.string().min(1, "Tagline is required").max(150),
  aboutText: z.string().min(1, "About text is required").max(1000),
  rateDisplay: z.string().min(1, "Rate is required").max(200),
  mealTimings: z.string().max(200).optional().or(z.literal("")),
  address: z.string().min(1, "Address is required").max(300),
  phone: z.string().min(1, "Phone is required").max(30),
  email: z.string().email("Enter a valid email address").optional().or(z.literal("")),
});
export type BusinessProfileInput = z.infer<typeof businessProfileSchema>;
