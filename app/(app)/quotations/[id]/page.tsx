import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateQuotationStatus } from "@/lib/actions/quotations";
import { formatDate, lineTotal, moneyLabel } from "@/lib/format";
import { quotationStatusClass, quotationStatusLabel } from "@/lib/status";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/media";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import WhatsAppLink from "@/components/WhatsAppLink";

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quotation, settings] = await Promise.all([
    prisma.quotation.findUnique({
      where: { id },
      include: { customer: true, items: true },
    }),
    getSettings(),
  ]);
  if (!quotation) notFound();
  const vehicle = [quotation.vehicleMake, quotation.vehicleModel, quotation.vehicleYear, quotation.vehicleTrim]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="dashboard-content">
      <PageHeader title={quotation.quoteNumber} subtitle={`${quotation.customer.name} · عرض غير رسمي`}>
        <StatusBadge label={quotationStatusLabel[quotation.status]} className={quotationStatusClass[quotation.status]} />
      </PageHeader>
      <div className="action-row">
        <Link href={`/quotations/${quotation.id}/print`} className="primary-button compact-button">
          طباعة / PDF
        </Link>
        <WhatsAppLink
          href={waLink(
            quotation.customer.whatsapp || quotation.customer.phone,
            `${settings.workshopName}\nعرض سعر غير رسمي ${quotation.quoteNumber}\n${vehicle}\nالإجمالي ${moneyLabel(quotation.total)}\nهذا العرض غير ملزم وليس صادر عن أي وكيل.`,
            settings.countryCode,
          )}
          label="واتساب العرض"
        />
      </div>

      <section className="panel">
        <p>
          العميل: <Link href={`/customers/${quotation.customer.id}`}>{quotation.customer.name}</Link>
        </p>
        {quotation.beneficiaryName ? <p>لصالح: {quotation.beneficiaryName}</p> : null}
        <p>السيارة: {vehicle}</p>
        {quotation.vehicleColor ? <p>اللون: {quotation.vehicleColor}</p> : null}
        {quotation.vehicleSpecs ? <p className="complaint">{quotation.vehicleSpecs}</p> : null}
        <p>التاريخ: {formatDate(quotation.issuedAt)}</p>
        {quotation.validUntil ? <p>صالح حتى: {formatDate(quotation.validUntil)}</p> : null}
        <div className="job-list">
          {quotation.items.map((item) => (
            <div className="job-row" key={item.id}>
              <div>
                <strong>{item.description}</strong>
                <small>
                  {item.quantity} × {moneyLabel(item.unitPrice)}
                </small>
              </div>
              <span>{moneyLabel(lineTotal(item.quantity, item.unitPrice))}</span>
            </div>
          ))}
        </div>
        <div className="totals">
          <div>
            <span>المجموع</span>
            <strong>{moneyLabel(quotation.subtotal)}</strong>
          </div>
          <div>
            <span>الضريبة</span>
            <strong>{moneyLabel(quotation.tax)}</strong>
          </div>
          <div>
            <span>الإجمالي التقديري</span>
            <strong>{moneyLabel(quotation.total)}</strong>
          </div>
        </div>
        {quotation.notes ? <p className="muted complaint">{quotation.notes}</p> : null}
      </section>

      <section className="panel">
        <h2 className="section-title">حالة العرض</h2>
        <ActionForm action={updateQuotationStatus.bind(null, quotation.id)} className="stack-form">
          <label className="field">
            <span>الحالة</span>
            <select name="status" defaultValue={quotation.status}>
              {Object.entries(quotationStatusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            حفظ الحالة
          </button>
        </ActionForm>
      </section>
    </section>
  );
}
