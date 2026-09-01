import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moneyLabel } from "@/lib/format";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function PartsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim();
  const parts = await prisma.part.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { supplier: true },
    orderBy: { name: "asc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="قطع الغيار" subtitle="كتالوج القطع المعتمد في الورشة" actionHref="/parts/new" actionLabel="قطعة جديدة" />
      <form className="search-box" action="/parts">
        <input name="q" defaultValue={query} placeholder="ابحث بالاسم أو الرمز..." />
      </form>
      {parts.length === 0 ? (
        <EmptyState title="لا توجد قطع" actionHref="/parts/new" actionLabel="إضافة قطعة" />
      ) : (
        <div className="card-list">
          {parts.map((part) => (
            <Link key={part.id} href={`/parts/${part.id}`} className="list-card">
              <div>
                <strong>{part.name}</strong>
                <small>
                  {part.sku} · المتاح {part.quantity} {part.unit}
                </small>
              </div>
              <span className={part.quantity <= part.minQuantity ? "form-error" : "muted"}>
                {moneyLabel(part.salePrice)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
