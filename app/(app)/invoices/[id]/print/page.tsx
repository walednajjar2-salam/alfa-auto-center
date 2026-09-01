import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatDate, lineTotal, moneyLabel, vehicleTitle } from "@/lib/format";
import PrintButton from "@/components/PrintButton";

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [invoice, settings] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        workOrder: { include: { vehicle: true } },
        items: true,
        payments: true,
      },
    }),
    getSettings(),
  ]);
  if (!invoice) notFound();
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <section className="dashboard-content print-sheet">
      <PrintButton />
      <article className="panel print-receipt">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="ALFA" className="print-logo" />
        <h1>{settings.workshopName}</h1>
        <p className="muted">
          {settings.phone} {settings.address ? `· ${settings.address}` : ""}
        </p>
        <h2>{invoice.invoiceNumber}</h2>
        <p>العميل: {invoice.customer.name}</p>
        <p>الهاتف: {invoice.customer.phone}</p>
        {invoice.workOrder ? (
          <p>
            أمر {invoice.workOrder.orderNumber}
            {invoice.workOrder.vehicle ? ` · ${vehicleTitle(invoice.workOrder.vehicle)}` : ""}
          </p>
        ) : null}
        <p>التاريخ: {formatDate(invoice.issuedAt ?? invoice.createdAt)}</p>
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
        </div>
        <p className="muted">شكراً لثقتكم بمركز ألفا</p>
      </article>
    </section>
  );
}
