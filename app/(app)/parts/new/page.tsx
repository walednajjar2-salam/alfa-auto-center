import { prisma } from "@/lib/prisma";
import { createPart } from "@/lib/actions/parts";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function NewPartPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });
  return (
    <section className="dashboard-content">
      <PageHeader title="قطعة جديدة" />
      <div className="panel">
        <ActionForm action={createPart} className="stack-form">
          <div className="form-grid">
            <label className="field">
              <span>الرمز</span>
              <input name="sku" required placeholder="BRK-001" />
            </label>
            <label className="field">
              <span>الاسم</span>
              <input name="name" required />
            </label>
            <label className="field">
              <span>الماركة</span>
              <input name="brand" />
            </label>
            <label className="field">
              <span>التصنيف</span>
              <input name="category" placeholder="فرامل، زيوت..." />
            </label>
            <label className="field">
              <span>تكلفة الشراء</span>
              <input name="costPrice" type="number" step="0.01" defaultValue="0" />
            </label>
            <label className="field">
              <span>سعر البيع</span>
              <input name="salePrice" type="number" step="0.01" defaultValue="0" />
            </label>
            <label className="field">
              <span>الكمية الحالية</span>
              <input name="quantity" type="number" step="0.1" defaultValue="0" />
            </label>
            <label className="field">
              <span>حد التنبيه</span>
              <input name="minQuantity" type="number" step="0.1" defaultValue="2" />
            </label>
          </div>
          <label className="field">
            <span>المورد</span>
            <select name="supplierId" defaultValue="">
              <option value="">بدون مورد</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            حفظ القطعة
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
