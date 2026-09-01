import { createCustomer } from "@/lib/actions/customers";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default function NewCustomerPage() {
  return (
    <section className="dashboard-content">
      <PageHeader title="عميل جديد" subtitle="إضافة زبون إلى سجل المركز" />
      <div className="panel">
        <ActionForm action={createCustomer} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required placeholder="اسم العميل" />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="phone" required placeholder="07xxxxxxxx" />
          </label>
          <label className="field">
            <span>واتساب</span>
            <input name="whatsapp" placeholder="اختياري" />
          </label>
          <label className="field">
            <span>ملاحظات</span>
            <textarea name="notes" rows={3} />
          </label>
          <button className="primary-button" type="submit">
            حفظ العميل
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
