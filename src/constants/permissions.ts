/**
 * Every permission key in the system, grouped by module. This is the single
 * source of truth: prisma/seed.ts inserts one Permission row per key here,
 * and requirePermission()/hasPermission() calls reference these constants
 * instead of raw strings so a typo fails at compile time, not at runtime.
 */
export const PERMISSIONS = {
  users: {
    view: "users.view",
    create: "users.create",
    update: "users.update",
    delete: "users.delete",
  },
  roles: {
    view: "roles.view",
    manage: "roles.manage",
  },
  customers: {
    view: "customers.view",
    create: "customers.create",
    update: "customers.update",
    delete: "customers.delete",
  },
  attendance: {
    view: "attendance.view",
    mark: "attendance.mark",
  },
  billing: {
    view: "billing.view",
    generateInvoice: "billing.generate_invoice",
  },
  payments: {
    view: "payments.view",
    record: "payments.record",
    refund: "payments.refund",
  },
  expenses: {
    view: "expenses.view",
    create: "expenses.create",
  },
  income: {
    view: "income.view",
    create: "income.create",
  },
  reminders: {
    view: "reminders.view",
    send: "reminders.send",
  },
  reports: {
    view: "reports.view",
  },
  settings: {
    manage: "settings.manage",
  },
  auditLogs: {
    view: "audit_logs.view",
  },
} as const;

// keyof over a union of differently-shaped groups collapses to their common
// keys (often none), so this deliberately maps per-group first and unions
// the results afterwards instead of indexing the union directly.
type ValuesPerGroup = {
  [K in keyof typeof PERMISSIONS]: (typeof PERMISSIONS)[K][keyof (typeof PERMISSIONS)[K]];
};
export type PermissionKey = ValuesPerGroup[keyof ValuesPerGroup];

export const ALL_PERMISSION_KEYS: PermissionKey[] = Object.values(PERMISSIONS).flatMap(
  (group) => Object.values(group) as PermissionKey[],
);
