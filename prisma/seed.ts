import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma";
import { ALL_PERMISSION_KEYS, PERMISSIONS } from "../src/constants/permissions";
import { SYSTEM_ROLE_IDS } from "../src/constants/roles";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ROLE_DEFINITIONS = [
  { id: SYSTEM_ROLE_IDS.ADMIN, name: "Admin", description: "Full access: customers, billing, expenses, reports, users, and settings." },
  { id: SYSTEM_ROLE_IDS.STAFF, name: "Staff", description: "Day-to-day operations: mark attendance, view customers and billing." },
] as const;

// Default permission matrix per system role. Admins can extend this later
// via Users > Roles & Permissions by creating custom roles and toggling permissions.
const ROLE_PERMISSIONS: Record<string, string[]> = {
  [SYSTEM_ROLE_IDS.ADMIN]: [...ALL_PERMISSION_KEYS],
  [SYSTEM_ROLE_IDS.STAFF]: [
    PERMISSIONS.customers.view,
    PERMISSIONS.attendance.view, PERMISSIONS.attendance.mark,
    PERMISSIONS.billing.view,
    PERMISSIONS.payments.view, PERMISSIONS.payments.record,
    PERMISSIONS.reminders.view, PERMISSIONS.reminders.send,
  ],
};

async function main() {
  console.log("Seeding permissions...");
  for (const key of ALL_PERMISSION_KEYS) {
    const [module] = key.split(".");
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key, module },
    });
  }

  console.log("Seeding system roles...");
  for (const role of ROLE_DEFINITIONS) {
    await prisma.role.upsert({
      where: { id: role.id },
      update: { name: role.name, description: role.description },
      create: { ...role, isSystem: true },
    });
  }

  console.log("Linking role permissions...");
  for (const [roleId, permissionKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const permissions = await prisma.permission.findMany({
      where: { key: { in: permissionKeys } },
      select: { id: true },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId } });
    await prisma.rolePermission.createMany({
      data: permissions.map((p) => ({ roleId, permissionId: p.id })),
      skipDuplicates: true,
    });
  }

  console.log("Bootstrapping Admin...");
  const adminCount = await prisma.user.count({ where: { roleId: SYSTEM_ROLE_IDS.ADMIN } });
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL ?? "admin@mess.local";
    const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

    const user = await prisma.user.create({
      data: {
        name: "Admin",
        email,
        emailVerified: true,
        roleId: SYSTEM_ROLE_IDS.ADMIN,
        status: "ACTIVE",
      },
    });
    await prisma.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: await hashPassword(password),
      },
    });
    console.log(`Created Admin ${email} — sign in and change this password immediately.`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
