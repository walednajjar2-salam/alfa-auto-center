import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/lib/actions/customers";
import { vehicleTitle } from "@/lib/format";
import { workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      vehicles: { orderBy: { createdAt: "desc" } },
      workOrders: { take: 8, orderBy: { createdAt: "desc" }, include: { vehicle: true } },
    },
  });
  if (!customer) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={customer.name} subtitle={customer.phone} actionHref="/reception" actionLabel="استقبال" />
      <div className="panel">
        <h2 className="section-title">بيانات العميل</h2>
        <ActionForm action={updateCustomer.bind(null, customer.id)} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required defaultValue={customer.name} />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="phone" required defaultValue={customer.phone} />
          </label>
          <label className="field">
            <span>واتساب</span>
            <input name="whatsapp" defaultValue={customer.whatsapp ?? ""} />
          </label>
          <label className="field">
            <span>ملاحظات</span>
            <textarea name="notes" rows={3} defaultValue={customer.notes ?? ""} />
          </label>
          <button className="primary-button" type="submit">
            حفظ التعديلات
          </button>
        </ActionForm>
      </div>

      <section className="panel">
        <div className="panel-title">
          <h2>السيارات</h2>
          <Link href={`/vehicles/new?customerId=${customer.id}`}>إضافة سيارة</Link>
        </div>
        {customer.vehicles.length === 0 ? (
          <EmptyState title="لا توجد سيارات" actionHref={`/vehicles/new?customerId=${customer.id}`} actionLabel="إضافة سيارة" />
        ) : (
          <div className="card-list">
            {customer.vehicles.map((v) => (
              <Link key={v.id} href={`/vehicles/${v.id}`} className="list-card">
                <div>
                  <strong>{vehicleTitle(v)}</strong>
                  <small>{v.color ?? "بدون لون"}</small>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>أوامر العمل</h2>
        </div>
        {customer.workOrders.length === 0 ? (
          <p className="muted">لا توجد أوامر بعد</p>
        ) : (
          <div className="job-list">
            {customer.workOrders.map((order) => (
              <Link className="job-row" key={order.id} href={`/work-orders/${order.id}`}>
                <div>
                  <strong>{order.orderNumber}</strong>
                  <small>{vehicleTitle(order.vehicle)}</small>
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
