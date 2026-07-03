"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { useCustomers, useDeleteCustomer } from "@/features/customers/hooks/use-customers";
import { buildCustomerColumns, type CustomerRow } from "@/features/customers/components/columns";
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";

export function CustomersView() {
  const { data, isLoading, isError, refetch } = useCustomers();
  const deleteCustomer = useDeleteCustomer();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRow | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerRow | null>(null);

  const columns = useMemo(
    () =>
      buildCustomerColumns(
        (customer) => {
          setEditingCustomer(customer);
          setFormOpen(true);
        },
        (customer) => setDeletingCustomer(customer),
      ),
    [],
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data ?? []}
        searchColumn="name"
        searchPlaceholder="Search by name..."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        emptyTitle="No customers yet"
        emptyDescription="Add your first customer to start tracking attendance and billing."
        toolbar={
          <Button
            onClick={() => {
              setEditingCustomer(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Add customer
          </Button>
        }
      />

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editingCustomer} />

      <AlertDialog open={!!deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deletingCustomer?.name}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes them from the active customer list. Their attendance, billing, and payment history is kept
              for your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingCustomer) deleteCustomer.mutate(deletingCustomer.id);
                setDeletingCustomer(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
