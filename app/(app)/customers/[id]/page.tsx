import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCustomer } from "@/lib/actions/customers";
import { moneyLabel, vehicleTitle } from "@/lib/format";
import { quotationStatusClass, quotationStatusLabel, workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import { PLACEHOLDERS, waLink } from "@/lib/media";
import { getSettings } from "@/lib/settings";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import ListThumb from "@/components/ListThumb";
import WhatsAppLink from "@/components/WhatsAppLink";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [customer, settings] = await Promise.all([
    prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: { orderBy: { createdAt: "desc" } },
        workOrders: { take: 8, orderBy: { createdAt: "desc" }, include: { vehicle: true } },
        quotations: { take: 8, orderBy: { createdAt: "desc" } },
      },
    }),
    getSettings(),
  ]);
  if (!customer) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={customer.name} subtitle={customer.phone} actionHref="/reception" actionLabel="استقبال" />
      <div className="action-row">
        <WhatsAppLink
          href={waLink(
            customer.whatsapp || customer.phone,
            `${settings.workshopName}\nمرحباً ${customer.name}`,
            settings.countryCode,
          )}
          label="واتساب العميل"
        />
      </div>
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
                <ListThumb src={PLACEHOLDERS.car} alt="" />
                <div className="list-card-body">
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

      <section className="panel">
        <div className="panel-title">
          <h2>عروض الأسعار</h2>
          <Link href={`/quotations/new?customerId=${customer.id}`}>عرض جديد</Link>
        </div>
        {customer.quotations.length === 0 ? (
          <p className="muted">لا توجد عروض أسعار</p>
        ) : (
          <div className="job-list">
            {customer.quotations.map((quote) => (
              <Link className="job-row" key={quote.id} href={`/quotations/${quote.id}`}>
                <div>
                  <strong>{quote.quoteNumber}</strong>
                  <small>
                    {quote.vehicleMake} {quote.vehicleModel}
                    {quote.vehicleYear ? ` ${quote.vehicleYear}` : ""} · {moneyLabel(quote.total)}
                  </small>
                </div>
                <StatusBadge label={quotationStatusLabel[quote.status]} className={quotationStatusClass[quote.status]} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
