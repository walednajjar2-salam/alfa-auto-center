import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moneyLabel, vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import MetricCard from "@/components/MetricCard";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { CarFront, CircleDollarSign, TrendingDown, WalletCards } from "lucide-react";

export default async function ReportsPage() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const [payments, expenses, orders, parts, topCustomers, recent] = await Promise.all([
    prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: start } } }),
    prisma.expense.aggregate({ _sum: { amount: true }, where: { spentAt: { gte: start } } }),
    prisma.workOrder.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.part.findMany({ orderBy: { quantity: "asc" }, take: 40 }),
    prisma.workOrder.groupBy({
      by: ["customerId"],
      _count: { _all: true },
      orderBy: { _count: { customerId: "desc" } },
      take: 5,
    }),
    prisma.workOrder.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    }),
  ]);

  const lowFiltered = parts.filter((p) => p.quantity <= p.minQuantity);
  const customers = await prisma.customer.findMany({
    where: { id: { in: topCustomers.map((c) => c.customerId) } },
  });
  const customerMap = Object.fromEntries(customers.map((c) => [c.id, c.name]));
  const revenue = payments._sum.amount ?? 0;
  const spent = expenses._sum.amount ?? 0;
  const inShop = orders
    .filter((o) => ["RECEIVED", "INSPECTION", "WAITING_APPROVAL", "IN_SERVICE"].includes(o.status))
    .reduce((sum, o) => sum + o._count._all, 0);

  return (
    <section className="dashboard-content">
      <PageHeader title="التقارير" subtitle="ملخص هذا الشهر" />
      <section className="metrics-grid">
        <MetricCard label="إيرادات الشهر" value={moneyLabel(revenue)} icon={CircleDollarSign} tone="green" />
        <MetricCard label="مصاريف الشهر" value={moneyLabel(spent)} icon={TrendingDown} tone="red" />
        <MetricCard label="صافي الشهر" value={moneyLabel(revenue - spent)} icon={WalletCards} tone="gold" />
        <MetricCard label="داخل الورشة" value={String(inShop)} icon={CarFront} tone="blue" />
      </section>

      <section className="panel">
        <h2 className="section-title">أوامر العمل حسب الحالة</h2>
        {orders.length === 0 ? <p className="muted">لا أوامر بعد</p> : null}
        {orders.map((o) => (
          <Link key={o.status} href={`/work-orders?status=${o.status}`} className="job-row">
            <StatusBadge label={workOrderStatusLabel[o.status]} className={workOrderStatusClass[o.status]} />
            <strong>{o._count._all}</strong>
          </Link>
        ))}
      </section>

      <section className="panel">
        <h2 className="section-title">أكثر العملاء زيارة</h2>
        {topCustomers.length === 0 ? <p className="muted">لا بيانات بعد</p> : null}
        {topCustomers.map((row) => (
          <Link key={row.customerId} href={`/customers/${row.customerId}`} className="job-row">
            <strong>{customerMap[row.customerId] ?? row.customerId}</strong>
            <span className="muted">{row._count._all} أمر</span>
          </Link>
        ))}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>نواقص المخزون</h2>
          <Link href="/inventory">المخزون</Link>
        </div>
        {lowFiltered.length === 0 ? <p className="muted">لا نواقص حالياً</p> : null}
        {lowFiltered.map((p) => (
          <Link key={p.id} href={`/parts/${p.id}`} className="job-row">
            <strong>{p.name}</strong>
            <span className="form-error">
              {p.quantity} / {p.minQuantity}
            </span>
          </Link>
        ))}
      </section>

      <section className="panel">
        <h2 className="section-title">آخر الأوامر</h2>
        {recent.map((order) => (
          <Link key={order.id} href={`/work-orders/${order.id}`} className="job-row">
            <div>
              <strong>{vehicleTitle(order.vehicle)}</strong>
              <small>{order.orderNumber}</small>
            </div>
            <StatusBadge label={workOrderStatusLabel[order.status]} className={workOrderStatusClass[order.status]} />
          </Link>
        ))}
      </section>
    </section>
  );
}
