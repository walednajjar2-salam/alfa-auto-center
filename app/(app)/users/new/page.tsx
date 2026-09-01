import { createUser } from "@/lib/actions/users";
import { requireAdmin } from "@/lib/session";
import { roleLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import type { UserRole } from "@prisma/client";

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <section className="dashboard-content">
      <PageHeader title="مستخدم جديد" />
      <div className="panel">
        <ActionForm action={createUser} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required />
          </label>
          <label className="field">
            <span>اسم المستخدم</span>
            <input name="username" required />
          </label>
          <label className="field">
            <span>كلمة المرور</span>
            <input name="password" type="password" required minLength={6} />
          </label>
          <label className="field">
            <span>الدور</span>
            <select name="role" defaultValue="RECEPTION">
              {(Object.keys(roleLabel) as UserRole[]).map((role) => (
                <option key={role} value={role}>
                  {roleLabel[role]}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            إنشاء المستخدم
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
