import PrintButton from "@/components/PrintButton";

export default function PublicQuotePage() {
  return (
    <section className="dashboard-content print-sheet" style={{ paddingTop: 18 }}>
      <div className="action-row no-print" style={{ justifyContent: "space-between" }}>
        <a href="/" className="ghost-button">
          مركز ألفا
        </a>
        <PrintButton />
      </div>
      <article className="panel print-receipt quote-sheet">
        <p className="quote-unofficial-banner">عرض سعر غير رسمي — غير ملزم</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="ALFA" className="print-logo" />
        <h1>مركز ألفا لصيانة السيارات</h1>
        <p className="muted">عمان، الأردن</p>
        <h2>QT-2026-00001</h2>
        <p className="quote-stamp">صادر عن مركز ألفا · ليس عرض وكيل سيارات</p>
        <div className="meta-grid">
          <div>
            <small>باسم</small>
            <strong>وليد محمد النجار</strong>
          </div>
          <div>
            <small>لصالح</small>
            <strong>يزن محمد عبدالهادي النجار</strong>
          </div>
        </div>
        <div className="meta-grid">
          <div>
            <small>السيارة</small>
            <strong>رنج روفر Range Rover 2025 SE</strong>
          </div>
          <div>
            <small>التاريخ</small>
            <strong>4 أيلول 2026</strong>
            <p>صالح حتى 18 أيلول 2026</p>
          </div>
        </div>
        <p className="complaint">تقدير سوق غير رسمي — المواصفات النهائية حسب الاتفاق، وليست عرض الوكيل المعتمد.</p>
        <div className="job-list">
          <div className="job-row">
            <div>
              <strong>رنج روفر موديل 2025 — تقدير سعر غير رسمي</strong>
              <small>1 × 110,000.00 د.أ</small>
            </div>
            <span>110,000.00 د.أ</span>
          </div>
        </div>
        <div className="totals">
          <div>
            <span>المجموع</span>
            <strong>110,000.00 د.أ</strong>
          </div>
          <div>
            <span>الضريبة</span>
            <strong>0.00 د.أ</strong>
          </div>
          <div>
            <span>الإجمالي التقديري</span>
            <strong>110,000.00 د.أ</strong>
          </div>
        </div>
        <section className="quote-terms">
          <h3>شروط العرض</h3>
          <ul>
            <li>هذا عرض سعر غير رسمي صادر عن مركز ألفا لصيانة السيارات فقط.</li>
            <li>ليس فاتورة، وليس عقد بيع، وليس عرضاً من أي وكيل معتمد.</li>
            <li>الأسعار تقديرية وقابلة للتغيير حسب التوفر والمواصفات النهائية.</li>
            <li>لا يُستخدم هذا المستند للتمويل أو الجمارك أو التأمين بصفة عرض وكيل.</li>
          </ul>
        </section>
        <p className="muted complaint">
          عرض سعر غير رسمي صادر عن مركز ألفا لصيانة السيارات. ليس عرض الوكيل المعتمد، وغير ملزم لأي طرف، والأسعار تقديرية
          وقابلة للتغيير. السعر تقديري من مركز ألفا ولا يشمل الرسوم الحكومية أو التأمين إلا إذا ذُكر خلاف ذلك.
        </p>
        <div className="quote-signs">
          <div>
            <span>توقيع المركز</span>
          </div>
          <div>
            <span>اطلاع المستفيد</span>
          </div>
        </div>
      </article>
    </section>
  );
}
