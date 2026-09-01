import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { recordPayment } from "@/lib/actions/invoices";
import { formatDate, lineTotal, moneyLabel } from "@/lib/format";
import { invoiceStatusClass, invoiceStatusLabel, paymentMethodLabel } from "@/lib/status";
import { getSettings } from "@/lib/settings";
import { waLink } from "@/lib/media";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import WhatsAppLink from "@/components/WhatsAppLink";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      workOrder: { include: { vehicle: true } },
      items: true,
      payments: { orderBy: { paidAt: "desc" } },
    },
    }),
    getSettings(),
  ]);
  if (!invoice) notFound();
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = Math.round((invoice.total - paid) * 1000) / 1000;

  return (
    <section className="dashboard-content">
      <PageHeader title={invoice.invoiceNumber} subtitle={invoice.customer.name}>
        <StatusBadge label={invoiceStatusLabel[invoice.status]} className={invoiceStatusClass[invoice.status]} />
      </PageHeader>
      <div className="action-row">
        <Link href={`/invoices/${invoice.id}/print`} className="primary-button compact-button">
          طباعة / PDF
        </Link>
        <WhatsAppLink
          href={waLink(
            invoice.customer.whatsapp || invoice.customer.phone,
            `${settings.workshopName}\nفاتورة ${invoice.invoiceNumber}\nالإجمالي ${moneyLabel(invoice.total)}`,
            settings.countryCode,
          )}
          label="واتساب الفاتورة"
        />
      </div>

      <section className="panel">
        {invoice.workOrder ? (
          <p>
            أمر العمل: <Link href={`/work-orders/${invoice.workOrder.id}`}>{invoice.workOrder.orderNumber}</Link>
          </p>
        ) : null}
        <div className="job-list">
          {invoice.items.map((item) => (
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
            <strong>{moneyLabel(invoice.subtotal)}</strong>
          </div>
          <div>
            <span>الضريبة</span>
            <strong>{moneyLabel(invoice.tax)}</strong>
          </div>
          <div>
            <span>الإجمالي</span>
            <strong>{moneyLabel(invoice.total)}</strong>
          </div>
          <div>
            <span>المدفوع</span>
            <strong>{moneyLabel(paid)}</strong>
          </div>
          <div>
            <span>المتبقي</span>
            <strong>{moneyLabel(remaining)}</strong>
          </div>
        </div>
      </section>

      {remaining > 0 && invoice.status !== "VOID" && invoice.status !== "DRAFT" ? (
        <section className="panel">
          <h2 className="section-title">تسجيل دفعة</h2>
          <ActionForm action={recordPayment.bind(null, invoice.id)} className="stack-form">
            <div className="form-grid">
              <label className="field">
                <span>المبلغ</span>
                <input name="amount" type="number" step="0.01" defaultValue={remaining} required />
              </label>
              <label className="field">
                <span>الطريقة</span>
                <select name="method" defaultValue="CASH">
                  <option value="CASH">نقداً</option>
                  <option value="CARD">بطاقة</option>
                  <option value="TRANSFER">تحويل</option>
                  <option value="OTHER">أخرى</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>ملاحظة</span>
              <input name="notes" />
            </label>
            <button className="primary-button" type="submit">
              حفظ الدفعة
            </button>
          </ActionForm>
        </section>
      ) : null}

      <section className="panel">
        <h2 className="section-title">سجل الدفعات</h2>
        {invoice.payments.length === 0 ? (
          <p className="muted">لا توجد دفعات</p>
        ) : (
          <div className="job-list">
            {invoice.payments.map((payment) => (
              <div className="job-row" key={payment.id}>
                <div>
                  <strong>{moneyLabel(payment.amount)}</strong>
                  <small>
                    {paymentMethodLabel[payment.method]} · {formatDate(payment.paidAt)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
