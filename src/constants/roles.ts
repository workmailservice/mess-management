/**
 * Stable ids for the 2 seeded system roles (see prisma/seed.ts).
 * Unlike custom roles an Admin creates later (which get a random cuid),
 * these use fixed slugs so they can be referenced directly in code
 * (e.g. Better Auth's default roleId for new accounts).
 */
export const SYSTEM_ROLE_IDS = {
  ADMIN: "admin",
  STAFF: "staff",
} as const;

export type SystemRoleId = (typeof SYSTEM_ROLE_IDS)[keyof typeof SYSTEM_ROLE_IDS];
