export default function NotFound() {
  return (
    <section className="dashboard-content">
      <div className="panel empty-state">
        <strong>الصفحة غير موجودة</strong>
        <p>تحقق من الرابط أو ارجع إلى لوحة التحكم</p>
        <a href="/dashboard" className="primary-button compact-button">
          لوحة التحكم
        </a>
      </div>
    </section>
  );
}
