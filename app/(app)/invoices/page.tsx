import Link from "next/link";
import type { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { moneyLabel } from "@/lib/format";
import { invoiceStatusClass, invoiceStatusLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = status && status in invoiceStatusLabel ? (status as InvoiceStatus) : undefined;
  const invoices = await prisma.invoice.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: { customer: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="الفواتير" subtitle="حسابات الورشة" />
      <div className="chip-row">
        {[
          ["", "الكل"],
          ["ISSUED", "صادرة"],
          ["PARTIAL", "جزئي"],
          ["PAID", "مدفوعة"],
        ].map(([value, label]) => (
          <Link
            key={value || "all"}
            href={value ? `/invoices?status=${value}` : "/invoices"}
            className={`chip ${(!status && !value) || status === value ? "chip-active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      {invoices.length === 0 ? (
        <EmptyState title="لا توجد فواتير" hint="أصدر فاتورة من أمر العمل بعد إضافة البنود" />
      ) : (
        <div className="card-list">
          {invoices.map((invoice) => {
            const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
            return (
              <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="list-card">
                <div>
                  <strong>{invoice.invoiceNumber}</strong>
                  <small>
                    {invoice.customer.name} · المتبقي {moneyLabel(Math.max(invoice.total - paid, 0))}
                  </small>
                </div>
                <StatusBadge label={invoiceStatusLabel[invoice.status]} className={invoiceStatusClass[invoice.status]} />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
