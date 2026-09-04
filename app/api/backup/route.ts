import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const [users, customers, vehicles, workOrders, invoices, quotations, payments, parts, suppliers, purchases, expenses, appointments, settings] =
    await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, username: true, role: true, isActive: true, createdAt: true } }),
      prisma.customer.findMany(),
      prisma.vehicle.findMany(),
      prisma.workOrder.findMany({ include: { items: true, inspections: { include: { photos: true } } } }),
      prisma.invoice.findMany({ include: { items: true } }),
      prisma.quotation.findMany({ include: { items: true } }),
      prisma.payment.findMany(),
      prisma.part.findMany(),
      prisma.supplier.findMany(),
      prisma.purchase.findMany({ include: { items: true } }),
      prisma.expense.findMany(),
      prisma.appointment.findMany(),
      prisma.workshopSettings.findMany(),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    users,
    customers,
    vehicles,
    workOrders,
    invoices,
    quotations,
    payments,
    parts,
    suppliers,
    purchases,
    expenses,
    appointments,
    settings,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="alfa-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
