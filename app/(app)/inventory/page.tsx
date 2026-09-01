import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moneyLabel } from "@/lib/format";
import { PLACEHOLDERS } from "@/lib/media";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ListThumb from "@/components/ListThumb";

export default async function InventoryPage() {
  const parts = await prisma.part.findMany({
    orderBy: [{ quantity: "asc" }, { name: "asc" }],
  });
  const low = parts.filter((p) => p.quantity <= p.minQuantity);

  return (
    <section className="dashboard-content">
      <PageHeader title="المخزون" subtitle={`${low.length} قطعة تحت حد التنبيه`} actionHref="/purchases/new" actionLabel="مشترى جديد" />
      {parts.length === 0 ? (
        <EmptyState title="المخزون فارغ" actionHref="/parts/new" actionLabel="إضافة قطعة" />
      ) : (
        <div className="card-list">
          {parts.map((part) => (
            <Link key={part.id} href={`/parts/${part.id}`} className="list-card">
              <ListThumb src={PLACEHOLDERS.part} alt="" />
              <div className="list-card-body">
                <strong>{part.name}</strong>
                <small>
                  {part.sku} · حد التنبيه {part.minQuantity}
                </small>
              </div>
              <span className={part.quantity <= part.minQuantity ? "form-error" : "ok-text"}>
                {part.quantity} {part.unit} · {moneyLabel(part.salePrice)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
