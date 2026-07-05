import { z } from "zod";

export const auditLogFiltersSchema = z.object({
  entityType: z.string().optional(),
  action: z.string().optional(),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type AuditLogFilters = z.infer<typeof auditLogFiltersSchema>;
