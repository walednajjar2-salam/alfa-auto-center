"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function saveInspection(workOrderId: string, formData: FormData) {
  const findings = String(formData.get("findings") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim() || null;
  const recommendations = String(formData.get("recommendations") ?? "").trim() || null;
  const estimatedLabor = Number(formData.get("estimatedLabor") ?? 0) || 0;
  const estimatedParts = Number(formData.get("estimatedParts") ?? 0) || 0;
  if (!findings) throw new Error("أدخل نتائج الفحص");

  await prisma.inspection.create({
    data: {
      workOrderId,
      findings,
      diagnosis,
      recommendations,
      estimatedLabor,
      estimatedParts,
    },
  });

  await prisma.workOrder.update({
    where: { id: workOrderId },
    data: { status: "WAITING_APPROVAL" },
  });

  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
  redirect(`/work-orders/${workOrderId}`);
}

export async function setInspectionApproval(workOrderId: string, approved: boolean, formData?: FormData) {
  const latest = await prisma.inspection.findFirst({
    where: { workOrderId },
    orderBy: { createdAt: "desc" },
  });
  if (!latest) throw new Error("لا يوجد فحص للموافقة عليه");

  const approvalNote = String(formData?.get("approvalNote") ?? "").trim() || null;
  await prisma.inspection.update({
    where: { id: latest.id },
    data: { customerApproved: approved, approvalNote },
  });
  await prisma.workOrder.update({
    where: { id: workOrderId },
    data: { status: approved ? "IN_SERVICE" : "CANCELLED" },
  });
  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${workOrderId}`);
}
