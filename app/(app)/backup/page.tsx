import { requireAdmin } from "@/lib/session";
import PageHeader from "@/components/PageHeader";

export default async function BackupPage() {
  await requireAdmin();
  return (
    <section className="dashboard-content">
      <PageHeader title="النسخ الاحتياطي" subtitle="تنزيل نسخة JSON من بيانات الورشة" />
      <div className="panel">
        <p>يحفظ الزبائن، السيارات، الأوامر، الفواتير، المخزون، والمصاريف في ملف يمكنك أرشفته خارج Railway.</p>
        <a className="primary-button compact-button" href="/api/backup">
          تنزيل النسخة الآن
        </a>
      </div>
    </section>
  );
}
