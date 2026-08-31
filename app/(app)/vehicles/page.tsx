import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { vehicleTitle } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const vehicles = await prisma.vehicle.findMany({
    where: query
      ? {
          OR: [
            { plateNumber: { contains: query, mode: "insensitive" } },
            { make: { contains: query, mode: "insensitive" } },
            { model: { contains: query, mode: "insensitive" } },
            { vin: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="السيارات" subtitle="أسطول عملاء المركز" actionHref="/vehicles/new" actionLabel="سيارة جديدة" />
      <form className="search-box" action="/vehicles">
        <input name="q" defaultValue={query} placeholder="ابحث باللوحة أو الماركة..." />
      </form>
      {vehicles.length === 0 ? (
        <EmptyState title="لا توجد سيارات" actionHref="/vehicles/new" actionLabel="إضافة سيارة" />
      ) : (
        <div className="card-list">
          {vehicles.map((v) => (
            <Link key={v.id} href={`/vehicles/${v.id}`} className="list-card">
              <div>
                <strong>{vehicleTitle(v)}</strong>
                <small>{v.customer.name}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
