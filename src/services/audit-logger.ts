import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/permissions";
import type { Prisma } from "@/generated/prisma";

interface AuditLogInput {
  action: "CREATE" | "UPDATE" | "DELETE" | "DEACTIVATE" | "REACTIVATE" | "PASSWORD_RESET";
  entityType: string;
  entityId?: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
}

/** Called from every mutating Service method — never from a Route/Server Action directly. */
export async function logAudit(input: AuditLogInput) {
  const [session, requestHeaders] = await Promise.all([getCurrentSession(), headers()]);

  await prisma.auditLog.create({
    data: {
      userId: session?.user.id,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      changesBefore: input.before,
      changesAfter: input.after,
      ipAddress: requestHeaders.get("x-forwarded-for") ?? requestHeaders.get("x-real-ip") ?? undefined,
      userAgent: requestHeaders.get("user-agent") ?? undefined,
    },
  });
}
