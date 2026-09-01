import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const visits = await prisma.workOrder.findMany({
    where: query
      ? {
          OR: [
            { orderNumber: { contains: query, mode: "insensitive" } },
            { customer: { name: { contains: query, mode: "insensitive" } } },
            { vehicle: { plateNumber: { contains: query, mode: "insensitive" } } },
          ],
        }
      : undefined,
    include: { customer: true, vehicle: true },
    orderBy: { createdAt: "desc" },
    take: 80,
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="سجل الزيارات" subtitle="كل أوامر العمل حسب تاريخ الاستقبال" />
      <form className="search-box" action="/visits">
        <input name="q" defaultValue={query} placeholder="عميل، لوحة، رقم أمر..." />
      </form>
      {visits.length === 0 ? (
        <EmptyState title="لا توجد زيارات" actionHref="/reception" actionLabel="استقبال سيارة" />
      ) : (
        <div className="card-list">
          {visits.map((v) => (
            <Link key={v.id} href={`/work-orders/${v.id}`} className="list-card">
              <div>
                <strong>{v.customer.name}</strong>
                <small>
                  {vehicleTitle(v.vehicle)} · {formatDate(v.createdAt)}
                </small>
              </div>
              <StatusBadge label={workOrderStatusLabel[v.status]} className={workOrderStatusClass[v.status]} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
