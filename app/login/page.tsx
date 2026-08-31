import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-overlay" />
      <section className="login-card glass-card">
        <div className="brand-mark">α</div>
        <div className="brand-copy">
          <h1>مركز ألفا لصيانة السيارات</h1>
          <p>ALFA AUTO CENTER</p>
          <small>خبرة منذ 2006</small>
        </div>
        <div className="welcome-block">
          <h2>مرحباً بك</h2>
          <p>سجّل الدخول لإدارة أعمال المركز</p>
        </div>
        <LoginForm />
        <p className="login-footer">© 2026 مركز ألفا لصيانة السيارات</p>
      </section>
    </main>
  );
}
