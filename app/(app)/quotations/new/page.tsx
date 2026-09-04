import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createQuotation } from "@/lib/actions/quotations";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

const RANGE_ROVER_PRESET = {
  newCustomerName: "وليد محمد النجار",
  newCustomerPhone: "0790004004",
  beneficiaryName: "يزن محمد عبدالهادي النجار",
  vehicleMake: "رنج روفر",
  vehicleModel: "Range Rover",
  vehicleYear: "2025",
  vehicleTrim: "SE",
  vehicleColor: "",
  vehicleSpecs: "تقدير سوق غير رسمي — المواصفات النهائية حسب الاتفاق، وليست عرض الوكيل المعتمد",
  description: "رنج روفر موديل 2025 — تقدير سعر غير رسمي",
  unitPrice: "110000",
  notes: "السعر تقديري من مركز ألفا ولا يشمل الرسوم الحكومية أو التأمين إلا إذا ذُكر خلاف ذلك.",
};

export default async function NewQuotationPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; preset?: string }>;
}) {
  const { customerId, preset } = await searchParams;
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });
  const usePreset = preset === "range-rover-2025";
  const selectedCustomer = customerId || (usePreset ? customers.find((c) => c.phone === RANGE_ROVER_PRESET.newCustomerPhone)?.id : "");
  const defaults = usePreset ? RANGE_ROVER_PRESET : null;
  const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return (
    <section className="dashboard-content">
      <PageHeader title="عرض سعر غير رسمي" subtitle="باسم مركز ألفا — غير ملزم وليس عرض وكيل" />
      <div className="panel">
        <p className="muted">كل عرض يُطبع بوضوح أنه غير رسمي وغير صادر عن أي وكيل سيارات.</p>
        {!usePreset ? (
          <p>
            <Link href="/quotations/new?preset=range-rover-2025">تعبئة عرض رنج روفر 2025 (وليد / يزن)</Link>
          </p>
        ) : null}
        <ActionForm action={createQuotation} className="stack-form">
          <label className="field">
            <span>العميل</span>
            <select name="customerId" defaultValue={selectedCustomer || ""}>
              <option value="">عميل جديد</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} · {c.phone}
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label className="field">
              <span>اسم العميل الجديد</span>
              <input name="newCustomerName" defaultValue={selectedCustomer ? "" : defaults?.newCustomerName ?? ""} placeholder="وليد محمد النجار" />
            </label>
            <label className="field">
              <span>هاتف العميل الجديد</span>
              <input name="newCustomerPhone" defaultValue={selectedCustomer ? "" : defaults?.newCustomerPhone ?? ""} placeholder="07xxxxxxxx" />
            </label>
          </div>
          <label className="field">
            <span>لصالح</span>
            <input name="beneficiaryName" defaultValue={defaults?.beneficiaryName ?? ""} placeholder="يزن محمد عبدالهادي النجار" />
          </label>
          <div className="form-grid">
            <label className="field">
              <span>النوع</span>
              <input name="vehicleMake" required defaultValue={defaults?.vehicleMake ?? ""} placeholder="رنج روفر" />
            </label>
            <label className="field">
              <span>الموديل</span>
              <input name="vehicleModel" required defaultValue={defaults?.vehicleModel ?? ""} placeholder="Range Rover" />
            </label>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>السنة</span>
              <input name="vehicleYear" type="number" defaultValue={defaults?.vehicleYear ?? ""} placeholder="2025" />
            </label>
            <label className="field">
              <span>الفئة</span>
              <input name="vehicleTrim" defaultValue={defaults?.vehicleTrim ?? ""} placeholder="SE" />
            </label>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>اللون</span>
              <input name="vehicleColor" defaultValue={defaults?.vehicleColor ?? ""} />
            </label>
            <label className="field">
              <span>صالح حتى</span>
              <input name="validUntil" type="date" defaultValue={validUntil} />
            </label>
          </div>
          <label className="field">
            <span>المواصفات</span>
            <textarea name="vehicleSpecs" rows={3} defaultValue={defaults?.vehicleSpecs ?? ""} />
          </label>
          <div className="quote-items">
            <strong>البنود</strong>
            {[0, 1, 2].map((index) => (
              <div className="form-grid quote-item-row" key={index}>
                <label className="field">
                  <span>البيان</span>
                  <input
                    name="description"
                    defaultValue={index === 0 ? defaults?.description ?? "" : ""}
                    placeholder={index === 0 ? "رنج روفر موديل 2025" : "بند إضافي"}
                  />
                </label>
                <label className="field">
                  <span>الكمية</span>
                  <input name="quantity" type="number" step="0.01" defaultValue={index === 0 && defaults ? "1" : ""} />
                </label>
                <label className="field">
                  <span>السعر</span>
                  <input name="unitPrice" type="number" step="0.01" defaultValue={index === 0 ? defaults?.unitPrice ?? "" : ""} />
                </label>
              </div>
            ))}
          </div>
          <label className="field">
            <span>ملاحظة إضافية</span>
            <textarea name="notes" rows={3} defaultValue={defaults?.notes ?? ""} />
          </label>
          <button className="primary-button" type="submit">
            إصدار العرض وطباعته
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
