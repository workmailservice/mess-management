import { prisma } from "@/lib/prisma";
import { parseDateOnly } from "@/lib/date";

export function findManyCustomers() {
  return prisma.customer.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export function findCustomerById(id: string) {
  return prisma.customer.findFirst({ where: { id, deletedAt: null } });
}

export function findCustomerByPhone(phone: string) {
  return prisma.customer.findFirst({ where: { phone, deletedAt: null } });
}

export function countActiveCustomers() {
  return prisma.customer.count({ where: { deletedAt: null, status: "ACTIVE" } });
}

export function findActiveCustomersForBilling() {
  return prisma.customer.findMany({
    where: { deletedAt: null, status: "ACTIVE" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true, monthlyRate: true },
  });
}

export function createCustomer(data: {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  monthlyRate: number;
  joinDate: string;
  advancePaid: number;
  advancePending: number;
}) {
  return prisma.customer.create({ data: { ...data, joinDate: parseDateOnly(data.joinDate) } });
}

export function updateCustomer(
  id: string,
  data: {
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    monthlyRate: number;
    joinDate: string;
    advancePaid: number;
    advancePending: number;
    status: "ACTIVE" | "INACTIVE";
  },
) {
  return prisma.customer.update({ where: { id }, data: { ...data, joinDate: parseDateOnly(data.joinDate) } });
}

export function softDeleteCustomer(id: string) {
  return prisma.customer.update({ where: { id }, data: { deletedAt: new Date(), status: "INACTIVE" } });
}
