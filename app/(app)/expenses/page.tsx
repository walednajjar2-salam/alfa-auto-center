import { prisma } from "@/lib/prisma";
import { formatDate, moneyLabel } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({ orderBy: { spentAt: "desc" }, take: 80 });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return (
    <section className="dashboard-content">
      <PageHeader title="المصاريف" subtitle={`الإجمالي المعروض ${moneyLabel(total)}`} actionHref="/expenses/new" actionLabel="مصروف جديد" />
      {expenses.length === 0 ? (
        <EmptyState title="لا توجد مصاريف" actionHref="/expenses/new" actionLabel="تسجيل مصروف" />
      ) : (
        <div className="card-list">
          {expenses.map((e) => (
            <article key={e.id} className="list-card">
              <div>
                <strong>{e.title}</strong>
                <small>
                  {e.category} · {formatDate(e.spentAt)}
                </small>
              </div>
              <span>
                {moneyLabel(e.amount)} · {paymentMethodLabel[e.method]}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
