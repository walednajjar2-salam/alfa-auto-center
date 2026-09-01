"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { lineTotal } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { nextInvoiceNumber } from "@/lib/numbers";

function invoiceTotals(items: { quantity: number; unitPrice: number }[], taxRate = 0) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitPrice), 0);
  const tax = Math.round(subtotal * taxRate * 1000) / 1000;
  return { subtotal, tax, total: Math.round((subtotal + tax) * 1000) / 1000 };
}

async function refreshInvoiceStatus(invoiceId: string) {
  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (invoice.status === "VOID" || invoice.status === "DRAFT") return invoice.status;
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const status = paid <= 0 ? "ISSUED" : paid + 0.001 >= invoice.total ? "PAID" : "PARTIAL";
  if (status !== invoice.status) {
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status } });
  }
  return status;
}

export async function createInvoiceFromWorkOrder(workOrderId: string) {
  const workOrder = await prisma.workOrder.findUniqueOrThrow({
    where: { id: workOrderId },
    include: { items: true, invoice: true },
  });
  if (workOrder.invoice) redirect(`/invoices/${workOrder.invoice.id}`);
  if (workOrder.items.length === 0) throw new Error("أضف بنود عمل أو قطع قبل إصدار الفاتورة");

  const settings = await getSettings();
  const totals = invoiceTotals(workOrder.items, settings.taxPercent / 100);
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: await nextInvoiceNumber(),
      customerId: workOrder.customerId,
      workOrderId: workOrder.id,
      status: "ISSUED",
      issuedAt: new Date(),
      notes: `فاتورة أمر العمل ${workOrder.orderNumber}`,
      ...totals,
      items: {
        create: workOrder.items.map((item) => ({
          description: `${item.kind === "PART" ? "قطعة" : "أجور"} — ${item.description}`,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
  });

  revalidatePath("/invoices");
  revalidatePath(`/work-orders/${workOrderId}`);
  redirect(`/invoices/${invoice.id}`);
}

export async function recordPayment(invoiceId: string, formData: FormData) {
  const amount = Number(formData.get("amount") ?? 0);
  const method = (String(formData.get("method") ?? "CASH") as PaymentMethod) || "CASH";
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!amount || amount <= 0) throw new Error("أدخل مبلغاً صحيحاً");

  const invoice = await prisma.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    include: { payments: true },
  });
  if (invoice.status === "VOID" || invoice.status === "DRAFT") {
    throw new Error("لا يمكن الدفع على هذه الفاتورة");
  }
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.round((invoice.total - paid) * 1000) / 1000;
  if (amount - remaining > 0.01) throw new Error("المبلغ أكبر من المتبقي");

  await prisma.payment.create({
    data: { invoiceId, amount, method, notes },
  });
  await refreshInvoiceStatus(invoiceId);
  revalidatePath("/invoices");
  revalidatePath("/payments");
  revalidatePath("/dashboard");
  revalidatePath("/cash");
  revalidatePath("/reports");
  revalidatePath(`/invoices/${invoiceId}`);
}
