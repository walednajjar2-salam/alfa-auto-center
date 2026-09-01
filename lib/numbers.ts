import { prisma } from "./prisma";

export async function nextWorkOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `ALFA-${year}-`;
  const last = await prisma.workOrder.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const n = last ? Number(last.orderNumber.slice(-5)) + 1 : 1;
  return `${prefix}${String(n).padStart(5, "0")}`;
}

export async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;
  const last = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { invoiceNumber: "desc" },
    select: { invoiceNumber: true },
  });
  const n = last ? Number(last.invoiceNumber.slice(-5)) + 1 : 1;
  return `${prefix}${String(n).padStart(5, "0")}`;
}

export async function nextPurchaseNumber() {
  const year = new Date().getFullYear();
  const prefix = `PO-${year}-`;
  const last = await prisma.purchase.findFirst({
    where: { number: { startsWith: prefix } },
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const n = last ? Number(last.number.slice(-5)) + 1 : 1;
  return `${prefix}${String(n).padStart(5, "0")}`;
}
