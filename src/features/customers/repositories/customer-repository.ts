import { prisma } from "@/lib/prisma";

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

export function createCustomer(data: {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  monthlyRate: number;
}) {
  return prisma.customer.create({ data });
}

export function updateCustomer(
  id: string,
  data: {
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    monthlyRate: number;
    status: "ACTIVE" | "INACTIVE";
  },
) {
  return prisma.customer.update({ where: { id }, data });
}

export function softDeleteCustomer(id: string) {
  return prisma.customer.update({ where: { id }, data: { deletedAt: new Date(), status: "INACTIVE" } });
}
