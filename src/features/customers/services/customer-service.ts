import "server-only";
import { requirePermission } from "@/lib/auth/permissions";
import { logAudit } from "@/services/audit-logger";
import { PERMISSIONS } from "@/constants/permissions";
import * as customerRepo from "@/features/customers/repositories/customer-repository";
import type { CustomerInput } from "@/features/customers/schemas/customer-schema";

export async function listCustomers() {
  await requirePermission(PERMISSIONS.customers.view);
  return customerRepo.findManyCustomers();
}

/** No permission check — an aggregate count only, rendered as a stat on the public homepage. */
export async function getPublicActiveCustomerCount() {
  return customerRepo.countActiveCustomers();
}

export async function createCustomer(input: CustomerInput) {
  await requirePermission(PERMISSIONS.customers.create);

  const existing = await customerRepo.findCustomerByPhone(input.phone);
  if (existing) {
    throw new Error("A customer with this phone number already exists.");
  }

  const customer = await customerRepo.createCustomer({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    address: input.address || null,
    monthlyRate: input.monthlyRate,
  });

  await logAudit({ action: "CREATE", entityType: "Customer", entityId: customer.id, after: { name: input.name, phone: input.phone } });
  return customer;
}

export async function updateCustomer(id: string, input: CustomerInput) {
  await requirePermission(PERMISSIONS.customers.update);

  const before = await customerRepo.findCustomerById(id);
  if (!before) throw new Error("Customer not found.");

  if (input.phone !== before.phone) {
    const existing = await customerRepo.findCustomerByPhone(input.phone);
    if (existing) throw new Error("A customer with this phone number already exists.");
  }

  const customer = await customerRepo.updateCustomer(id, {
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    address: input.address || null,
    monthlyRate: input.monthlyRate,
    status: input.status,
  });

  await logAudit({
    action: "UPDATE",
    entityType: "Customer",
    entityId: id,
    before: { name: before.name, phone: before.phone, monthlyRate: before.monthlyRate.toString(), status: before.status },
    after: { name: input.name, phone: input.phone, monthlyRate: input.monthlyRate, status: input.status },
  });

  return customer;
}

export async function deleteCustomer(id: string) {
  await requirePermission(PERMISSIONS.customers.delete);

  const existing = await customerRepo.findCustomerById(id);
  if (!existing) throw new Error("Customer not found.");

  await customerRepo.softDeleteCustomer(id);
  await logAudit({ action: "DELETE", entityType: "Customer", entityId: id, before: { name: existing.name, phone: existing.phone } });
}
