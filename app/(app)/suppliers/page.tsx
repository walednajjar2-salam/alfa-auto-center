import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    include: { _count: { select: { parts: true, purchases: true } } },
    orderBy: { name: "asc" },
  });
  return (
    <section className="dashboard-content">
      <PageHeader title="الموردون" actionHref="/suppliers/new" actionLabel="مورد جديد" />
      {suppliers.length === 0 ? (
        <EmptyState title="لا يوجد موردون" actionHref="/suppliers/new" actionLabel="إضافة مورد" />
      ) : (
        <div className="card-list">
          {suppliers.map((s) => (
            <Link key={s.id} href={`/suppliers/${s.id}`} className="list-card">
              <div>
                <strong>{s.name}</strong>
                <small>{s.phone}</small>
              </div>
              <span className="muted">
                {s._count.parts} قطعة · {s._count.purchases} مشترى
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
