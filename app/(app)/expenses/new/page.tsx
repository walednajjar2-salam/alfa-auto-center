import { createExpense } from "@/lib/actions/expenses";
import { expenseCategories } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default function NewExpensePage() {
  return (
    <section className="dashboard-content">
      <PageHeader title="مصروف جديد" />
      <div className="panel">
        <ActionForm action={createExpense} className="stack-form">
          <label className="field">
            <span>البيان</span>
            <input name="title" required placeholder="فاتورة كهرباء..." />
          </label>
          <label className="field">
            <span>التصنيف</span>
            <select name="category" defaultValue="أخرى">
              {expenseCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <div className="form-grid">
            <label className="field">
              <span>المبلغ</span>
              <input name="amount" type="number" step="0.01" required />
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
            <span>التاريخ</span>
            <input name="spentAt" type="datetime-local" />
          </label>
          <label className="field">
            <span>ملاحظة</span>
            <input name="notes" />
          </label>
          <button className="primary-button" type="submit">
            حفظ المصروف
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
