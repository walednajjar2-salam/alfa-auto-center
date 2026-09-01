import Link from "next/link";
import type { WorkOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import { PLACEHOLDERS } from "@/lib/media";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import ListThumb from "@/components/ListThumb";

const filters: { value: string; label: string }[] = [
  { value: "", label: "الكل" },
  { value: "RECEIVED", label: "مستلمة" },
  { value: "INSPECTION", label: "فحص" },
  { value: "WAITING_APPROVAL", label: "موافقة" },
  { value: "IN_SERVICE", label: "صيانة" },
  { value: "READY", label: "جاهزة" },
];

export default async function WorkOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const query = q?.trim();
  const statusFilter = status && status in workOrderStatusLabel ? (status as WorkOrderStatus) : undefined;

  const orders = await prisma.workOrder.findMany({
    where: {
      status: statusFilter,
      ...(query
        ? {
            OR: [
              { orderNumber: { contains: query, mode: "insensitive" } },
              { complaint: { contains: query, mode: "insensitive" } },
              { customer: { name: { contains: query, mode: "insensitive" } } },
              { vehicle: { plateNumber: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { vehicle: true, customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="أوامر العمل" subtitle="متابعة السيارات داخل الورشة" actionHref="/reception" actionLabel="استقبال" />
      <form className="search-box" action="/work-orders">
        {statusFilter ? <input type="hidden" name="status" value={statusFilter} /> : null}
        <input name="q" defaultValue={query} placeholder="رقم الأمر، اللوحة، العميل..." />
      </form>
      <div className="chip-row">
        {filters.map((f) => (
          <Link
            key={f.value || "all"}
            href={f.value ? `/work-orders?status=${f.value}` : "/work-orders"}
            className={`chip ${(!status && !f.value) || status === f.value ? "chip-active" : ""}`}
          >
            {f.label}
          </Link>
        ))}
      </div>
      {orders.length === 0 ? (
        <EmptyState title="لا توجد أوامر" actionHref="/reception" actionLabel="استقبال سيارة" />
      ) : (
        <div className="card-list">
          {orders.map((order) => (
            <Link key={order.id} href={`/work-orders/${order.id}`} className="list-card">
              <ListThumb src={PLACEHOLDERS.car} alt="" />
              <div className="list-card-body">
                <strong>{vehicleTitle(order.vehicle)}</strong>
                <small>
                  {order.orderNumber} · {order.customer.name}
                </small>
              </div>
              <StatusBadge label={workOrderStatusLabel[order.status]} className={workOrderStatusClass[order.status]} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
