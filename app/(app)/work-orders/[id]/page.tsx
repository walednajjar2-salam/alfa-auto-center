import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addWorkOrderItem, removeWorkOrderItem } from "@/lib/actions/work-orders";
import { setInspectionApproval } from "@/lib/actions/inspections";
import { createInvoiceFromWorkOrder } from "@/lib/actions/invoices";
import { formatDate, lineTotal, moneyLabel, vehicleTitle } from "@/lib/format";
import { workOrderFlow, workOrderStatusClass, workOrderStatusLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import StatusButton from "@/components/StatusButton";

export default async function WorkOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      items: { orderBy: { createdAt: "asc" } },
      inspections: { orderBy: { createdAt: "desc" } },
      invoice: true,
    },
  });
  if (!order) notFound();
  const inspection = order.inspections[0];
  const itemsTotal = order.items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitPrice), 0);

  return (
    <section className="dashboard-content">
      <PageHeader title={order.orderNumber} subtitle={vehicleTitle(order.vehicle)}>
        <StatusBadge label={workOrderStatusLabel[order.status]} className={workOrderStatusClass[order.status]} />
      </PageHeader>

      <div className="stepper">
        {workOrderFlow.map((step) => (
          <span key={step} className={order.status === step ? "step active" : "step"}>
            {workOrderStatusLabel[step]}
          </span>
        ))}
      </div>

      <section className="panel">
        <div className="meta-grid">
          <div>
            <small>العميل</small>
            <Link href={`/customers/${order.customerId}`}>{order.customer.name}</Link>
            <p className="muted">{order.customer.phone}</p>
          </div>
          <div>
            <small>السيارة</small>
            <Link href={`/vehicles/${order.vehicleId}`}>{vehicleTitle(order.vehicle)}</Link>
            <p className="muted">{order.mileage ? `${order.mileage.toLocaleString()} كم` : "بدون عداد"}</p>
          </div>
        </div>
        <p className="complaint">{order.complaint}</p>
        {order.notes ? <p className="muted">{order.notes}</p> : null}
        <p className="muted">تاريخ الاستقبال: {formatDate(order.createdAt)}</p>
      </section>

      <section className="panel">
        <h2 className="section-title">حركة الأمر</h2>
        <div className="action-row">
          {order.status === "RECEIVED" ? (
            <Link href={`/work-orders/${order.id}/inspect`} className="primary-button compact-button">
              بدء الفحص
            </Link>
          ) : null}
          {order.status === "INSPECTION" ? (
            <Link href={`/work-orders/${order.id}/inspect`} className="primary-button compact-button">
              إكمال الفحص
            </Link>
          ) : null}
          {order.status === "IN_SERVICE" ? (
            <StatusButton id={order.id} status="READY" label="جاهزة للتسليم" className="primary-button compact-button" />
          ) : null}
          {order.status === "READY" ? (
            <StatusButton id={order.id} status="DELIVERED" label="تسليم السيارة" className="primary-button compact-button" />
          ) : null}
          {order.status !== "CANCELLED" && order.status !== "DELIVERED" ? (
            <StatusButton id={order.id} status="CANCELLED" label="إلغاء الأمر" className="danger-button" />
          ) : null}
        </div>
      </section>

      {inspection ? (
        <section className="panel">
          <div className="panel-title">
            <h2>الفحص</h2>
            <Link href={`/work-orders/${order.id}/inspect`}>فحص جديد</Link>
          </div>
          <p>{inspection.findings}</p>
          {inspection.diagnosis ? <p className="muted">التشخيص: {inspection.diagnosis}</p> : null}
          {inspection.recommendations ? <p className="muted">التوصية: {inspection.recommendations}</p> : null}
          <p className="muted">
            تقدير الأجور {moneyLabel(inspection.estimatedLabor)} · القطع {moneyLabel(inspection.estimatedParts)}
          </p>
          {inspection.customerApproved == null && order.status === "WAITING_APPROVAL" ? (
            <div className="action-row">
              <ActionForm action={setInspectionApproval.bind(null, order.id, true)}>
                <input name="approvalNote" placeholder="ملاحظة الموافقة (اختياري)" />
                <button className="primary-button compact-button" type="submit">
                  موافقة العميل
                </button>
              </ActionForm>
              <ActionForm action={setInspectionApproval.bind(null, order.id, false)}>
                <button className="danger-button" type="submit">
                  رفض
                </button>
              </ActionForm>
            </div>
          ) : inspection.customerApproved != null ? (
            <p className={inspection.customerApproved ? "ok-text" : "form-error"}>
              {inspection.customerApproved ? "وافق العميل على الإصلاح" : "رفض العميل الإصلاح"}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="panel">
        <div className="panel-title">
          <h2>بنود العمل</h2>
          <strong>{moneyLabel(itemsTotal)}</strong>
        </div>
        {order.items.length === 0 ? <p className="muted">لا توجد بنود بعد</p> : null}
        <div className="job-list">
          {order.items.map((item) => (
            <div className="job-row" key={item.id}>
              <div>
                <strong>{item.description}</strong>
                <small>
                  {item.kind === "PART" ? "قطعة" : "أجور"} · {item.quantity} × {moneyLabel(item.unitPrice)}
                </small>
              </div>
              <ActionForm action={removeWorkOrderItem.bind(null, order.id, item.id)}>
                <button type="submit" className="text-button">
                  حذف
                </button>
              </ActionForm>
            </div>
          ))}
        </div>
        {order.status !== "DELIVERED" && order.status !== "CANCELLED" ? (
          <ActionForm action={addWorkOrderItem.bind(null, order.id)} className="stack-form tight-form">
            <div className="form-grid">
              <label className="field">
                <span>النوع</span>
                <select name="kind" defaultValue="LABOR">
                  <option value="LABOR">أجور</option>
                  <option value="PART">قطعة</option>
                </select>
              </label>
              <label className="field">
                <span>الكمية</span>
                <input name="quantity" type="number" step="0.1" defaultValue="1" />
              </label>
              <label className="field">
                <span>السعر</span>
                <input name="unitPrice" type="number" step="0.01" defaultValue="0" />
              </label>
            </div>
            <label className="field">
              <span>الوصف</span>
              <input name="description" required placeholder="تغيير زيت، فلتر هواء..." />
            </label>
            <button className="ghost-button" type="submit">
              إضافة بند
            </button>
          </ActionForm>
        ) : null}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>الفاتورة</h2>
        </div>
        {order.invoice ? (
          <Link href={`/invoices/${order.invoice.id}`} className="primary-button compact-button">
            عرض الفاتورة {order.invoice.invoiceNumber}
          </Link>
        ) : (
          <ActionForm action={createInvoiceFromWorkOrder.bind(null, order.id)}>
            <button className="primary-button compact-button" type="submit">
              إصدار فاتورة
            </button>
          </ActionForm>
        )}
      </section>
    </section>
  );
}
