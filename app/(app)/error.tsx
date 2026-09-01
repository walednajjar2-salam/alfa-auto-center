"use client";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="panel">
      <h2>حدث خطأ</h2>
      <p className="form-error">{error.message || "تعذر إكمال العملية"}</p>
      <button className="primary-button compact-button" type="button" onClick={reset}>
        إعادة المحاولة
      </button>
    </section>
  );
}
