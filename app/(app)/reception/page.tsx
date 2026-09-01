import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import ReceptionForm from "@/components/ReceptionForm";

export default async function ReceptionPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: "asc" },
    include: {
      vehicles: {
        orderBy: { createdAt: "desc" },
        select: { id: true, plateNumber: true, make: true, model: true, year: true },
      },
    },
  });

  return (
    <section className="dashboard-content">
      <PageHeader title="استقبال سيارة" subtitle="تسجيل زيارة جديدة وإنشاء أمر عمل" />
      <div className="panel">
        <ReceptionForm customers={customers} />
      </div>
    </section>
  );
}
