import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePart } from "@/lib/actions/parts";
import { moneyLabel } from "@/lib/format";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function PartDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [part, suppliers] = await Promise.all([
    prisma.part.findUnique({ where: { id }, include: { supplier: true } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!part) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={part.name} subtitle={`${part.sku} · المتاح ${part.quantity} ${part.unit}`} />
      {part.quantity <= part.minQuantity ? (
        <p className="form-error">المخزون تحت حد التنبيه ({part.minQuantity})</p>
      ) : null}
      <div className="panel">
        <p className="muted">سعر البيع {moneyLabel(part.salePrice)}</p>
        <ActionForm action={updatePart.bind(null, part.id)} className="stack-form">
          <div className="form-grid">
            <label className="field">
              <span>الرمز</span>
              <input name="sku" required defaultValue={part.sku} />
            </label>
            <label className="field">
              <span>الاسم</span>
              <input name="name" required defaultValue={part.name} />
            </label>
            <label className="field">
              <span>الماركة</span>
              <input name="brand" defaultValue={part.brand ?? ""} />
            </label>
            <label className="field">
              <span>التصنيف</span>
              <input name="category" defaultValue={part.category ?? ""} />
            </label>
            <label className="field">
              <span>تكلفة الشراء</span>
              <input name="costPrice" type="number" step="0.01" defaultValue={part.costPrice} />
            </label>
            <label className="field">
              <span>سعر البيع</span>
              <input name="salePrice" type="number" step="0.01" defaultValue={part.salePrice} />
            </label>
            <label className="field">
              <span>الكمية</span>
              <input name="quantity" type="number" step="0.1" defaultValue={part.quantity} />
            </label>
            <label className="field">
              <span>حد التنبيه</span>
              <input name="minQuantity" type="number" step="0.1" defaultValue={part.minQuantity} />
            </label>
          </div>
          <label className="field">
            <span>المورد</span>
            <select name="supplierId" defaultValue={part.supplierId ?? ""}>
              <option value="">بدون مورد</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            حفظ التعديلات
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
