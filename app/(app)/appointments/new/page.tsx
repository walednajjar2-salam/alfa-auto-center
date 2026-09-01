import { prisma } from "@/lib/prisma";
import { createAppointment } from "@/lib/actions/appointments";
import { toDateTimeLocal } from "@/lib/format";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function NewAppointmentPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: { vehicles: true },
  });
  const defaultTime = new Date();
  defaultTime.setMinutes(0, 0, 0);
  defaultTime.setHours(defaultTime.getHours() + 1);

  return (
    <section className="dashboard-content">
      <PageHeader title="موعد جديد" />
      <div className="panel">
        {customers.length === 0 ? (
          <p className="muted">أضف عميلاً أولاً.</p>
        ) : (
          <ActionForm action={createAppointment} className="stack-form">
            <label className="field">
              <span>العميل</span>
              <select name="customerId" required defaultValue={customers[0]?.id}>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.phone}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>السيارة (اختياري)</span>
              <select name="vehicleId" defaultValue="">
                <option value="">بدون تحديد</option>
                {customers.flatMap((c) =>
                  c.vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {c.name} — {v.make} {v.model} · {v.plateNumber}
                    </option>
                  )),
                )}
              </select>
            </label>
            <label className="field">
              <span>التاريخ والوقت</span>
              <input name="scheduledAt" type="datetime-local" required defaultValue={toDateTimeLocal(defaultTime)} />
            </label>
            <label className="field">
              <span>السبب</span>
              <input name="reason" required placeholder="صيانة دورية، فحص..." />
            </label>
            <label className="field">
              <span>ملاحظات</span>
              <textarea name="notes" rows={3} />
            </label>
            <button className="primary-button" type="submit">
              حفظ الموعد
            </button>
          </ActionForm>
        )}
      </div>
    </section>
  );
}
