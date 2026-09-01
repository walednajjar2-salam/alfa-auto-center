import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const customers = await prisma.customer.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } },
          ],
        }
      : undefined,
    include: { _count: { select: { vehicles: true, workOrders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="العملاء" subtitle="سجل زبائن المركز" actionHref="/customers/new" actionLabel="عميل جديد" />
      <form className="search-box" action="/customers">
        <input name="q" defaultValue={query} placeholder="ابحث بالاسم أو الهاتف..." />
      </form>
      {customers.length === 0 ? (
        <EmptyState title="لا يوجد عملاء" hint="أضف أول عميل للمركز" actionHref="/customers/new" actionLabel="إضافة عميل" />
      ) : (
        <div className="card-list">
          {customers.map((c) => (
            <Link key={c.id} href={`/customers/${c.id}`} className="list-card">
              <div>
                <strong>{c.name}</strong>
                <small>{c.phone}</small>
              </div>
              <span className="muted">
                {c._count.vehicles} سيارة · {c._count.workOrders} أمر
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
