import Link from "next/link";
import { CalendarDays, CarFront, CircleDollarSign, ClipboardPlus, FileText, Search, ShieldCheck, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { money, todayLabel, vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export default async function DashboardPage() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const [inShop, ready, todayOrders, todayPayments, recentOrders] = await Promise.all([
    prisma.workOrder.count({
      where: { status: { in: ["RECEIVED", "INSPECTION", "WAITING_APPROVAL", "IN_SERVICE"] } },
    }),
    prisma.workOrder.count({ where: { status: "READY" } }),
    prisma.workOrder.count({ where: { createdAt: { gte: start } } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paidAt: { gte: start } },
    }),
    prisma.workOrder.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    }),
  ]);

  const revenue = todayPayments._sum.amount ?? 0;

  return (
    <section className="dashboard-content">
      <section className="hello-card">
        <div>
          <span>مرحباً بك 👋</span>
          <h1>لوحة التحكم</h1>
          <p>نظرة سريعة على نشاط المركز اليوم</p>
        </div>
        <div className="date-chip">
          <CalendarDays size={16} />
          <span>{todayLabel()}</span>
        </div>
      </section>

      <form className="search-box" action="/work-orders">
        <Search size={17} />
        <input name="q" placeholder="ابحث عن عميل، سيارة، أمر عمل..." />
      </form>

      <section className="metrics-grid">
        <MetricCard label="إيرادات اليوم" value={money(revenue)} unit="د.أ" icon={CircleDollarSign} tone="green" />
        <MetricCard label="داخل الورشة" value={String(inShop)} unit="سيارة" icon={CarFront} tone="blue" />
        <MetricCard label="أوامر اليوم" value={String(todayOrders)} unit="أمر" icon={CalendarDays} tone="violet" />
        <MetricCard label="جاهزة للتسليم" value={String(ready)} unit="سيارات" icon={ShieldCheck} tone="green" />
      </section>

      <section className="panel quick-panel">
        <div className="panel-title">
          <h2>إجراءات سريعة</h2>
        </div>
        <div className="quick-actions">
          <Link href="/reception">
            <CarFront size={19} />
            <span>استقبال سيارة</span>
          </Link>
          <Link href="/work-orders">
            <ClipboardPlus size={19} />
            <span>أمر عمل</span>
          </Link>
          <Link href="/work-orders?status=INSPECTION">
            <Wrench size={19} />
            <span>فحص وصيانة</span>
          </Link>
          <Link href="/invoices">
            <FileText size={19} />
            <span>فاتورة</span>
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>أوامر العمل الأخيرة</h2>
          <Link href="/work-orders">عرض الكل</Link>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState title="لا توجد أوامر بعد" hint="ابدأ باستقبال أول سيارة" actionHref="/reception" actionLabel="استقبال سيارة" />
        ) : (
          <div className="job-list">
            {recentOrders.map((order) => (
              <Link className="job-row" key={order.id} href={`/work-orders/${order.id}`}>
                <div>
                  <strong>{vehicleTitle(order.vehicle)}</strong>
                  <small>{order.orderNumber}</small>
                </div>
                <StatusBadge
                  label={workOrderStatusLabel[order.status]}
                  className={workOrderStatusClass[order.status]}
                />
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
