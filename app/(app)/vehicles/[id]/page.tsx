import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateVehicle } from "@/lib/actions/vehicles";
import { vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      customer: true,
      workOrders: { take: 8, orderBy: { createdAt: "desc" } },
    },
  });
  if (!vehicle) notFound();
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });

  return (
    <section className="dashboard-content">
      <PageHeader
        title={vehicleTitle(vehicle)}
        subtitle={vehicle.customer.name}
        actionHref={`/reception`}
        actionLabel="استقبال"
      />
      <div className="panel">
        <ActionForm action={updateVehicle.bind(null, vehicle.id)} className="stack-form">
          <label className="field">
            <span>العميل</span>
            <select name="customerId" defaultValue={vehicle.customerId}>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label className="field">
              <span>اللوحة</span>
              <input name="plateNumber" required defaultValue={vehicle.plateNumber} />
            </label>
            <label className="field">
              <span>الماركة</span>
              <input name="make" required defaultValue={vehicle.make} />
            </label>
            <label className="field">
              <span>الموديل</span>
              <input name="model" required defaultValue={vehicle.model} />
            </label>
            <label className="field">
              <span>سنة الصنع</span>
              <input name="year" type="number" defaultValue={vehicle.year ?? ""} />
            </label>
            <label className="field">
              <span>اللون</span>
              <input name="color" defaultValue={vehicle.color ?? ""} />
            </label>
            <label className="field">
              <span>العداد</span>
              <input name="mileage" type="number" defaultValue={vehicle.mileage ?? ""} />
            </label>
          </div>
          <label className="field">
            <span>رقم الشاصي</span>
            <input name="vin" defaultValue={vehicle.vin ?? ""} />
          </label>
          <button className="primary-button" type="submit">
            حفظ التعديلات
          </button>
        </ActionForm>
      </div>
      <section className="panel">
        <div className="panel-title">
          <h2>سجل الزيارات</h2>
        </div>
        {vehicle.workOrders.length === 0 ? (
          <p className="muted">لا توجد زيارات بعد</p>
        ) : (
          <div className="job-list">
            {vehicle.workOrders.map((order) => (
              <Link className="job-row" key={order.id} href={`/work-orders/${order.id}`}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <small>{order.complaint}</small>
                </div>
                <StatusBadge label={workOrderStatusLabel[order.status]} className={workOrderStatusClass[order.status]} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
