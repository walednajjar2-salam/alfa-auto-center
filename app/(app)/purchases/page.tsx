import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, moneyLabel } from "@/lib/format";
import { purchaseStatusClass, purchaseStatusLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

export default async function PurchasesPage() {
  const purchases = await prisma.purchase.findMany({
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <section className="dashboard-content">
      <PageHeader title="المشتريات" actionHref="/purchases/new" actionLabel="مشترى جديد" />
      {purchases.length === 0 ? (
        <EmptyState title="لا توجد مشتريات" actionHref="/purchases/new" actionLabel="إنشاء مشترى" />
      ) : (
        <div className="card-list">
          {purchases.map((p) => (
            <Link key={p.id} href={`/purchases/${p.id}`} className="list-card">
              <div>
                <strong>{p.number}</strong>
                <small>
                  {p.supplier.name} · {formatDate(p.createdAt)}
                </small>
              </div>
              <div style={{ textAlign: "left" }}>
                <StatusBadge label={purchaseStatusLabel[p.status]} className={purchaseStatusClass[p.status]} />
                <small className="muted">{moneyLabel(p.total)}</small>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
