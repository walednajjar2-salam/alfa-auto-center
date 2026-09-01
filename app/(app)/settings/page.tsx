import { getSettings } from "@/lib/settings";
import { updateSettings } from "@/lib/actions/settings";
import { requireAdmin } from "@/lib/session";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <section className="dashboard-content">
      <PageHeader title="الإعدادات" subtitle="بيانات المركز والضريبة" />
      <div className="panel">
        <ActionForm action={updateSettings} className="stack-form">
          <label className="field">
            <span>اسم المركز</span>
            <input name="workshopName" required defaultValue={settings.workshopName} />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="phone" defaultValue={settings.phone} />
          </label>
          <label className="field">
            <span>العنوان</span>
            <input name="address" defaultValue={settings.address} />
          </label>
          <label className="field">
            <span>نسبة الضريبة %</span>
            <input name="taxPercent" type="number" step="0.01" defaultValue={settings.taxPercent} />
          </label>
          <label className="field">
            <span>رمز الدولة للواتساب</span>
            <input name="countryCode" defaultValue={settings.countryCode} placeholder="962" />
          </label>
          <button className="primary-button" type="submit">
            حفظ الإعدادات
          </button>
        </ActionForm>
        <p className="muted" style={{ marginTop: 16 }}>
          <a href="/backup">تنزيل نسخة احتياطية</a>
        </p>
      </div>
    </section>
  );
}
