import { getPublicSettings } from "@/lib/settings";
import { waLink } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage() {
  const { settings, databaseReady } = await getPublicSettings();
  const href = waLink(
    settings.phone,
    `طلب إعادة تعيين كلمة مرور نظام ألفا — ${settings.workshopName}`,
    settings.countryCode,
  );

  return (
    <main className="login-page">
      <div className="login-overlay" />
      <section className="login-card glass-card">
        <div className="brand-mark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-192.png" alt="ALFA" className="login-logo" />
        </div>
        <div className="brand-copy">
          <h1>استعادة كلمة المرور</h1>
          <p>ALFA AUTO CENTER</p>
        </div>
        <div className="welcome-block">
          <h2>تواصل مع الإدارة</h2>
          <p>لا يمكن إعادة التعيين تلقائياً. اطلب من المدير تعيين كلمة جديدة من شاشة المستخدمين.</p>
        </div>
        {href ? (
          <a className="primary-button" href={href} target="_blank" rel="noreferrer">
            واتساب الإدارة
          </a>
        ) : !databaseReady ? (
          <p className="login-footer">قاعدة البيانات غير جاهزة حالياً. اربط PostgreSQL على Railway ثم أعد المحاولة.</p>
        ) : (
          <p className="login-footer">أضف هاتف المركز من الإعدادات ليظهر رابط واتساب.</p>
        )}
        <p className="login-footer">
          <a href="/login">العودة لتسجيل الدخول</a>
        </p>
      </section>
    </main>
  );
}
