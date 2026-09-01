import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateSupplier } from "@/lib/actions/suppliers";
import ActionForm from "@/components/ActionForm";
import PageHeader from "@/components/PageHeader";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { parts: { take: 8, orderBy: { name: "asc" } }, purchases: { take: 6, orderBy: { createdAt: "desc" } } },
  });
  if (!supplier) notFound();

  return (
    <section className="dashboard-content">
      <PageHeader title={supplier.name} subtitle={supplier.phone} actionHref="/purchases/new" actionLabel="مشترى" />
      <div className="panel">
        <ActionForm action={updateSupplier.bind(null, supplier.id)} className="stack-form">
          <label className="field">
            <span>الاسم</span>
            <input name="name" required defaultValue={supplier.name} />
          </label>
          <label className="field">
            <span>الهاتف</span>
            <input name="phone" required defaultValue={supplier.phone} />
          </label>
          <label className="field">
            <span>ملاحظات</span>
            <textarea name="notes" rows={3} defaultValue={supplier.notes ?? ""} />
          </label>
          <button className="primary-button" type="submit">
            حفظ
          </button>
        </ActionForm>
      </div>
      <section className="panel">
        <h2 className="section-title">القطع</h2>
        {supplier.parts.length === 0 ? (
          <p className="muted">لا توجد قطع مرتبطة</p>
        ) : (
          supplier.parts.map((p) => (
            <Link key={p.id} href={`/parts/${p.id}`} className="job-row">
              <strong>{p.name}</strong>
              <span className="muted">{p.quantity}</span>
            </Link>
          ))
        )}
      </section>
    </section>
  );
}
