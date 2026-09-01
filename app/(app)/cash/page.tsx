import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, moneyLabel } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import MetricCard from "@/components/MetricCard";
import { CircleDollarSign, TrendingDown, WalletCards } from "lucide-react";

export default async function CashPage() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [todayIn, todayOut, payments, expenses] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: start } } }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { spentAt: { gte: start } } }),
    prisma.payment.findMany({
      take: 12,
      orderBy: { paidAt: "desc" },
      include: { invoice: { include: { customer: true } } },
    }),
    prisma.expense.findMany({ take: 12, orderBy: { spentAt: "desc" } }),
  ]);

  const inflow = todayIn._sum.amount ?? 0;
  const outflow = todayOut._sum.amount ?? 0;

  return (
    <section className="dashboard-content">
      <PageHeader title="الصندوق" subtitle="حركة النقد اليوم" actionHref="/expenses/new" actionLabel="مصروف" />
      <section className="metrics-grid">
        <MetricCard label="وارد اليوم" value={moneyLabel(inflow)} icon={CircleDollarSign} tone="green" />
        <MetricCard label="منصرف اليوم" value={moneyLabel(outflow)} icon={TrendingDown} tone="red" />
        <MetricCard label="صافي اليوم" value={moneyLabel(inflow - outflow)} icon={WalletCards} tone="gold" />
      </section>
      <section className="panel">
        <div className="panel-title">
          <h2>الوارد</h2>
          <Link href="/payments">الكل</Link>
        </div>
        {payments.length === 0 ? <p className="muted">لا دفعات بعد</p> : null}
        {payments.map((p) => (
          <Link key={p.id} href={`/invoices/${p.invoiceId}`} className="job-row">
            <div>
              <strong>{p.invoice.customer.name}</strong>
              <small>
                {paymentMethodLabel[p.method]} · {formatDate(p.paidAt)}
              </small>
            </div>
            <span className="ok-text">{moneyLabel(p.amount)}</span>
          </Link>
        ))}
      </section>
      <section className="panel">
        <div className="panel-title">
          <h2>المنصرف</h2>
          <Link href="/expenses">الكل</Link>
        </div>
        {expenses.length === 0 ? <p className="muted">لا مصاريف بعد</p> : null}
        {expenses.map((e) => (
          <div key={e.id} className="job-row">
            <div>
              <strong>{e.title}</strong>
              <small>
                {e.category} · {formatDate(e.spentAt)}
              </small>
            </div>
            <span className="form-error">{moneyLabel(e.amount)}</span>
          </div>
        ))}
      </section>
    </section>
  );
}
