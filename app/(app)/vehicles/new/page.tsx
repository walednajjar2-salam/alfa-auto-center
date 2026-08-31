import { prisma } from "@/lib/prisma";
import { createVehicle } from "@/lib/actions/vehicles";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function NewVehiclePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="dashboard-content">
      <PageHeader title="سيارة جديدة" subtitle="ربط سيارة بعميل" />
      <div className="panel">
        {customers.length === 0 ? (
          <p className="muted">أضف عميلاً أولاً قبل تسجيل سيارة.</p>
        ) : (
          <ActionForm action={createVehicle} className="stack-form">
            <label className="field">
              <span>العميل</span>
              <select name="customerId" required defaultValue={customerId ?? customers[0]?.id}>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-grid">
              <label className="field">
                <span>اللوحة</span>
                <input name="plateNumber" required />
              </label>
              <label className="field">
                <span>الماركة</span>
                <input name="make" required />
              </label>
              <label className="field">
                <span>الموديل</span>
                <input name="model" required />
              </label>
              <label className="field">
                <span>سنة الصنع</span>
                <input name="year" type="number" />
              </label>
              <label className="field">
                <span>اللون</span>
                <input name="color" />
              </label>
              <label className="field">
                <span>العداد</span>
                <input name="mileage" type="number" />
              </label>
            </div>
            <label className="field">
              <span>رقم الشاصي</span>
              <input name="vin" />
            </label>
            <button className="primary-button" type="submit">
              حفظ السيارة
            </button>
          </ActionForm>
        )}
      </div>
    </section>
  );
}
