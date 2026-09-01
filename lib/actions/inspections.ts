"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PLACEHOLDERS } from "@/lib/media";
import { saveUploadedImage } from "@/lib/upload";
import { requireActionAccess } from "@/lib/guard";

export async function saveInspection(workOrderId: string, formData: FormData) {
  await requireActionAccess("/work-orders");
  const findings = String(formData.get("findings") ?? "").trim();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim() || null;
  const recommendations = String(formData.get("recommendations") ?? "").trim() || null;
  const estimatedLabor = Number(formData.get("estimatedLabor") ?? 0) || 0;
  const estimatedParts = Number(formData.get("estimatedParts") ?? 0) || 0;
  if (!findings) throw new Error("أدخل نتائج الفحص");

  const uploads: { url: string; kind: "BEFORE" | "AFTER" | "FINDING"; isPlaceholder: boolean }[] = [];
  for (const key of ["photoBefore", "photoAfter"] as const) {
    const saved = await saveUploadedImage(formData.get(key) as File | null);
    if (saved) {
      uploads.push({
        url: saved,
        kind: key === "photoBefore" ? "BEFORE" : "AFTER",
        isPlaceholder: false,
      });
    }
  }

  if (uploads.length === 0) {
    uploads.push(
      { url: PLACEHOLDERS.inspectBefore, kind: "BEFORE", isPlaceholder: true },
      { url: PLACEHOLDERS.inspectAfter, kind: "AFTER", isPlaceholder: true },
    );
  }

  await prisma.inspection.create({
    data: {
      workOrderId,
      findings,
      diagnosis,
      recommendations,
      estimatedLabor,
      estimatedParts,
      photos: {
        create: uploads.map((photo) => ({
          url: photo.url,
          kind: photo.kind,
          isPlaceholder: photo.isPlaceholder,
          caption: photo.isPlaceholder ? "صورة عامة مؤقتة حتى رفع صور الورشة" : null,
        })),
      },
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
  await requireActionAccess("/work-orders");
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
