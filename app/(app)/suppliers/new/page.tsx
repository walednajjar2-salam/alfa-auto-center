import { createSupplier } from "@/lib/actions/suppliers";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default function NewSupplierPage() {
  return (
    <section className="dashboard-content">
      <PageHeader title="مورد جديد" />
      <div className="panel">
        <ActionForm action={createSupplier} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="phone" required />
          </label>
          <label className="field">
            <span>ملاحظات</span>
            <textarea name="notes" rows={3} />
          </label>
          <button className="primary-button" type="submit">
            حفظ المورد
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
