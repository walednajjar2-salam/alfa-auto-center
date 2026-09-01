import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateTime, vehicleTitle } from "@/lib/format";
import { appointmentStatusClass, appointmentStatusLabel } from "@/lib/status";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import AppointmentStatusButton from "@/components/AppointmentStatusButton";

export default async function AppointmentsPage() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const appointments = await prisma.appointment.findMany({
    orderBy: { scheduledAt: "asc" },
    include: { customer: true, vehicle: true },
    take: 80,
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="المواعيد" subtitle="جدولة زيارات الورشة" actionHref="/appointments/new" actionLabel="موعد جديد" />
      {appointments.length === 0 ? (
        <EmptyState title="لا توجد مواعيد" actionHref="/appointments/new" actionLabel="إضافة موعد" />
      ) : (
        <div className="card-list">
          {appointments.map((a) => (
            <article key={a.id} className="list-card" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
              <div>
                <strong>{a.customer.name}</strong>
                <small>
                  {formatDateTime(a.scheduledAt)} · {a.reason}
                  {a.vehicle ? ` · ${vehicleTitle(a.vehicle)}` : ""}
                </small>
              </div>
              <StatusBadge label={appointmentStatusLabel[a.status]} className={appointmentStatusClass[a.status]} />
              <div className="action-row" style={{ width: "100%" }}>
                {a.status === "SCHEDULED" ? (
                  <AppointmentStatusButton id={a.id} status="CONFIRMED" label="تأكيد" className="ghost-button" />
                ) : null}
                {a.status === "SCHEDULED" || a.status === "CONFIRMED" ? (
                  <>
                    <Link href={`/reception`} className="primary-button compact-button">
                      استقبال
                    </Link>
                    <AppointmentStatusButton id={a.id} status="DONE" label="تم" className="ghost-button" />
                    <AppointmentStatusButton id={a.id} status="CANCELLED" label="إلغاء" className="danger-button" />
                  </>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
