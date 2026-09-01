import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, moneyLabel } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: { invoice: { include: { customer: true } } },
    orderBy: { paidAt: "desc" },
    take: 50,
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="المدفوعات" subtitle="حركة الصندوق" />
      {payments.length === 0 ? (
        <EmptyState title="لا توجد مدفوعات بعد" />
      ) : (
        <div className="card-list">
          {payments.map((payment) => (
            <Link key={payment.id} href={`/invoices/${payment.invoiceId}`} className="list-card">
              <div>
                <strong>{moneyLabel(payment.amount)}</strong>
                <small>
                  {payment.invoice.customer.name} · {payment.invoice.invoiceNumber}
                </small>
              </div>
              <span className="muted">
                {paymentMethodLabel[payment.method]} · {formatDate(payment.paidAt)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
