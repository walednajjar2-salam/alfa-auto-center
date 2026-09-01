"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const workshopName = String(formData.get("workshopName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const taxPercent = Number(formData.get("taxPercent") ?? 0) || 0;
  const countryCode = String(formData.get("countryCode") ?? "962").replace(/\D/g, "") || "962";
  if (!workshopName) throw new Error("اسم المركز مطلوب");
  await prisma.workshopSettings.upsert({
    where: { id: "default" },
    update: { workshopName, phone, address, taxPercent, countryCode },
    create: { id: "default", workshopName, phone, address, taxPercent, countryCode },
  });
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
