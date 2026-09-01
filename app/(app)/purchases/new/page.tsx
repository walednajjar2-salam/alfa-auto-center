import { prisma } from "@/lib/prisma";
import { createPurchase } from "@/lib/actions/purchases";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function NewPurchasePage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <section className="dashboard-content">
      <PageHeader title="مشترى جديد" />
      <div className="panel">
        {suppliers.length === 0 ? (
          <p className="muted">أضف مورداً أولاً من شاشة الموردين.</p>
        ) : (
          <ActionForm action={createPurchase} className="stack-form">
            <label className="field">
              <span>المورد</span>
              <select name="supplierId" required defaultValue={suppliers[0]?.id}>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>ملاحظات</span>
              <textarea name="notes" rows={3} />
            </label>
            <button className="primary-button" type="submit">
              إنشاء المسودة
            </button>
          </ActionForm>
        )}
      </div>
    </section>
  );
}
