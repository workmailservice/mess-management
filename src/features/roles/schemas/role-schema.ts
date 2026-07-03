import { z } from "zod";
import { ALL_PERMISSION_KEYS } from "@/constants/permissions";

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional().or(z.literal("")),
  permissionKeys: z.array(z.enum(ALL_PERMISSION_KEYS as [string, ...string[]])),
});
export type RoleInput = z.infer<typeof roleSchema>;
