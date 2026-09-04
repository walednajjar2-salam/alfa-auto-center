import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatDate, lineTotal, moneyLabel } from "@/lib/format";
import PrintButton from "@/components/PrintButton";

export default async function QuotationPrintPage({ params }: { params: Promise<{ id: string }> }) {
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
    <section className="dashboard-content print-sheet">
      <PrintButton />
      <article className="panel print-receipt quote-sheet">
        <p className="quote-unofficial-banner">عرض سعر غير رسمي — غير ملزم</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="ALFA" className="print-logo" />
        <h1>{settings.workshopName}</h1>
        <p className="muted">
          {settings.phone} {settings.address ? `· ${settings.address}` : ""}
        </p>
        <h2>{quotation.quoteNumber}</h2>
        <p className="quote-stamp">صادر عن مركز ألفا · ليس عرض وكيل سيارات</p>
        <div className="meta-grid">
          <div>
            <small>باسم</small>
            <strong>{quotation.customer.name}</strong>
            <p>{quotation.customer.phone}</p>
          </div>
          <div>
            <small>لصالح</small>
            <strong>{quotation.beneficiaryName || quotation.customer.name}</strong>
          </div>
        </div>
        <div className="meta-grid">
          <div>
            <small>السيارة</small>
            <strong>{vehicle}</strong>
            {quotation.vehicleColor ? <p>اللون: {quotation.vehicleColor}</p> : null}
          </div>
          <div>
            <small>التاريخ</small>
            <strong>{formatDate(quotation.issuedAt)}</strong>
            {quotation.validUntil ? <p>صالح حتى {formatDate(quotation.validUntil)}</p> : null}
          </div>
        </div>
        {quotation.vehicleSpecs ? <p className="complaint">{quotation.vehicleSpecs}</p> : null}
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
        <section className="quote-terms">
          <h3>شروط العرض</h3>
          <ul>
            <li>هذا عرض سعر غير رسمي صادر عن مركز ألفا لصيانة السيارات فقط.</li>
            <li>ليس فاتورة، وليس عقد بيع، وليس عرضاً من أي وكيل معتمد.</li>
            <li>الأسعار تقديرية وقابلة للتغيير حسب التوفر والمواصفات النهائية.</li>
            <li>لا يُستخدم هذا المستند للتمويل أو الجمارك أو التأمين بصفة عرض وكيل.</li>
          </ul>
        </section>
        {quotation.notes ? <p className="muted complaint">{quotation.notes}</p> : null}
        <div className="quote-signs">
          <div>
            <span>توقيع المركز</span>
          </div>
          <div>
            <span>اطلاع المستفيد</span>
          </div>
        </div>
      </article>
    </section>
  );
}
