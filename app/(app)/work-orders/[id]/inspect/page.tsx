import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveInspection } from "@/lib/actions/inspections";
import { vehicleTitle } from "@/lib/format";
import { PLACEHOLDERS } from "@/lib/media";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusButton from "@/components/StatusButton";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";

export default async function InspectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.workOrder.findUnique({
    where: { id },
    include: { vehicle: true, customer: true },
  });
  if (!order) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title="فحص وتشخيص" subtitle={`${order.orderNumber} · ${vehicleTitle(order.vehicle)}`} />
      <div className="panel">
        <p>
          <strong>{order.customer.name}</strong>
          <span className="muted"> — {order.complaint}</span>
        </p>
        <ActionForm action={saveInspection.bind(null, order.id)} className="stack-form" encType="multipart/form-data">
          <label className="field">
            <span>نتائج الفحص</span>
            <textarea name="findings" rows={4} required placeholder="ما الذي ظهر أثناء الفحص؟" />
          </label>
          <label className="field">
            <span>التشخيص</span>
            <textarea name="diagnosis" rows={3} />
          </label>
          <label className="field">
            <span>التوصيات</span>
            <textarea name="recommendations" rows={3} />
          </label>
          <div className="form-grid">
            <label className="field">
              <span>تقدير الأجور</span>
              <input name="estimatedLabor" type="number" step="0.01" defaultValue="0" />
            </label>
            <label className="field">
              <span>تقدير القطع</span>
              <input name="estimatedParts" type="number" step="0.01" defaultValue="0" />
            </label>
          </div>
          <p className="muted">صور عامة مؤقتة تظهر أدناه إلى أن ترفع صور الورشة الحقيقية.</p>
          <div className="photo-grid">
            <PlaceholderPhoto src={PLACEHOLDERS.inspectBefore} alt="قبل" caption="قبل — صورة عامة حتى الرفع" />
            <PlaceholderPhoto src={PLACEHOLDERS.inspectAfter} alt="بعد" caption="بعد — صورة عامة حتى الرفع" />
          </div>
          <div className="form-grid">
            <label className="field">
              <span>رفع صورة قبل</span>
              <input name="photoBefore" type="file" accept="image/*" />
            </label>
            <label className="field">
              <span>رفع صورة بعد</span>
              <input name="photoAfter" type="file" accept="image/*" />
            </label>
          </div>
          <button className="primary-button" type="submit">
            حفظ الفحص وطلب الموافقة
          </button>
        </ActionForm>
        {order.status === "RECEIVED" ? (
          <div style={{ marginTop: 12 }}>
            <StatusButton id={order.id} status="INSPECTION" label="تعليم الأمر قيد الفحص فقط" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
