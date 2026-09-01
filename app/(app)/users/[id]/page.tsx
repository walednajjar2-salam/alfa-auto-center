import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateUser } from "@/lib/actions/users";
import { requireAdmin } from "@/lib/session";
import { roleLabel } from "@/lib/status";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";
import type { UserRole } from "@prisma/client";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={user.name} subtitle={user.username} />
      <div className="panel">
        <ActionForm action={updateUser.bind(null, user.id)} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required defaultValue={user.name} />
          </label>
          <label className="field">
            <span>اسم المستخدم</span>
            <input name="username" required defaultValue={user.username} />
          </label>
          <label className="field">
            <span>كلمة مرور جديدة</span>
            <input name="password" type="password" placeholder="اتركها فارغة للإبقاء على الحالية" />
          </label>
          <label className="field">
            <span>الدور</span>
            <select name="role" defaultValue={user.role}>
              {(Object.keys(roleLabel) as UserRole[]).map((role) => (
                <option key={role} value={role}>
                  {roleLabel[role]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>الحالة</span>
            <select name="isActive" defaultValue={user.isActive ? "true" : "false"}>
              <option value="true">نشط</option>
              <option value="false">موقوف</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            حفظ
          </button>
        </ActionForm>
      </div>
    </section>
  );
}
