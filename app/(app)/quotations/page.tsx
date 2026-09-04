import Link from "next/link";
import type { QuotationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { moneyLabel } from "@/lib/format";
import { quotationStatusClass, quotationStatusLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = status && status in quotationStatusLabel ? (status as QuotationStatus) : undefined;
  const quotations = await prisma.quotation.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="dashboard-content">
      <PageHeader
        title="عروض الأسعار"
        subtitle="عروض غير رسمية وغير ملزمة باسم مركز ألفا"
        actionHref="/quotations/new"
        actionLabel="عرض جديد"
      />
      <div className="chip-row">
        {[
          ["", "الكل"],
          ["ISSUED", "صادرة"],
          ["ACCEPTED", "مقبولة"],
          ["EXPIRED", "منتهية"],
        ].map(([value, label]) => (
          <Link
            key={value || "all"}
            href={value ? `/quotations?status=${value}` : "/quotations"}
            className={`chip ${(!status && !value) || status === value ? "chip-active" : ""}`}
          >
            {label}
          </Link>
        ))}
      </div>
      {quotations.length === 0 ? (
        <EmptyState
          title="لا توجد عروض أسعار"
          hint="أنشئ عرض سعر غير رسمي للعميل من هنا"
          actionHref="/quotations/new"
          actionLabel="عرض جديد"
        />
      ) : (
        <div className="card-list">
          {quotations.map((quote) => (
            <Link key={quote.id} href={`/quotations/${quote.id}`} className="list-card">
              <div>
                <strong>{quote.quoteNumber}</strong>
                <small>
                  {quote.customer.name}
                  {quote.beneficiaryName ? ` · لصالح ${quote.beneficiaryName}` : ""} · {moneyLabel(quote.total)}
                </small>
              </div>
              <StatusBadge label={quotationStatusLabel[quote.status]} className={quotationStatusClass[quote.status]} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
