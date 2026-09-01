"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireActionAccess } from "@/lib/guard";

export async function createAppointment(formData: FormData) {
  await requireActionAccess("/appointments");
  const customerId = String(formData.get("customerId") ?? "").trim();
  const vehicleId = String(formData.get("vehicleId") ?? "").trim() || null;
  const reason = String(formData.get("reason") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const scheduledAtRaw = String(formData.get("scheduledAt") ?? "").trim();
  if (!customerId || !reason || !scheduledAtRaw) {
    throw new Error("العميل وسبب الموعد والتاريخ مطلوبة");
  }
  await prisma.appointment.create({
    data: {
      customerId,
      vehicleId,
      reason,
      notes,
      scheduledAt: new Date(scheduledAtRaw),
    },
  });
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
  redirect("/appointments");
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  await requireActionAccess("/appointments");
  await prisma.appointment.update({ where: { id }, data: { status } });
  revalidatePath("/appointments");
  revalidatePath("/dashboard");
}
