import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addPurchaseItem, cancelPurchase, receivePurchase, removePurchaseItem } from "@/lib/actions/purchases";
import { formatDate, lineTotal, moneyLabel } from "@/lib/format";
import { purchaseStatusClass, purchaseStatusLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default async function PurchaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [purchase, parts] = await Promise.all([
    prisma.purchase.findUnique({
      where: { id },
      include: { supplier: true, items: { include: { part: true } } },
    }),
    prisma.part.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!purchase) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={purchase.number} subtitle={purchase.supplier.name}>
        <StatusBadge label={purchaseStatusLabel[purchase.status]} className={purchaseStatusClass[purchase.status]} />
      </PageHeader>
      <section className="panel">
        <p className="muted">تاريخ الإنشاء {formatDate(purchase.createdAt)}</p>
        {purchase.receivedAt ? <p className="muted">استُلم في {formatDate(purchase.receivedAt)}</p> : null}
        <div className="job-list">
          {purchase.items.map((item) => (
            <div className="job-row" key={item.id}>
              <div>
                <strong>{item.part.name}</strong>
                <small>
                  {item.quantity} × {moneyLabel(item.unitCost)}
                </small>
              </div>
              <div>
                <span>{moneyLabel(lineTotal(item.quantity, item.unitCost))}</span>
                {purchase.status === "DRAFT" ? (
                  <ActionForm action={removePurchaseItem.bind(null, purchase.id, item.id)}>
                    <button type="submit" className="text-button">
                      حذف
                    </button>
                  </ActionForm>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        <p>
          الإجمالي <strong>{moneyLabel(purchase.total)}</strong>
        </p>
      </section>
      {purchase.status === "DRAFT" ? (
        <>
          <section className="panel">
            <h2 className="section-title">إضافة بند</h2>
            {parts.length === 0 ? (
              <p className="muted">أضف قطعاً في الكتالوج أولاً</p>
            ) : (
              <ActionForm action={addPurchaseItem.bind(null, purchase.id)} className="stack-form">
                <label className="field">
                  <span>القطعة</span>
                  <select name="partId" required>
                    {parts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} · {p.sku}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="form-grid">
                  <label className="field">
                    <span>الكمية</span>
                    <input name="quantity" type="number" step="0.1" defaultValue="1" />
                  </label>
                  <label className="field">
                    <span>تكلفة الوحدة</span>
                    <input name="unitCost" type="number" step="0.01" defaultValue={parts[0]?.costPrice ?? 0} />
                  </label>
                </div>
                <button className="ghost-button" type="submit">
                  إضافة
                </button>
              </ActionForm>
            )}
          </section>
          <div className="action-row">
            <ActionForm action={receivePurchase.bind(null, purchase.id)}>
              <button className="primary-button compact-button" type="submit">
                استلام وزيادة المخزون
              </button>
            </ActionForm>
            <ActionForm action={cancelPurchase.bind(null, purchase.id)}>
              <button className="danger-button" type="submit">
                إلغاء
              </button>
            </ActionForm>
          </div>
        </>
      ) : null}
    </section>
  );
}
