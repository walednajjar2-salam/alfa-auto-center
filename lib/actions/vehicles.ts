"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireActionAccess } from "@/lib/guard";

function readVehicle(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "").trim();
  const plateNumber = String(formData.get("plateNumber") ?? "").trim();
  const make = String(formData.get("make") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const vin = String(formData.get("vin") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "").trim() || null;
  const yearRaw = String(formData.get("year") ?? "").trim();
  const mileageRaw = String(formData.get("mileage") ?? "").trim();
  const year = yearRaw ? Number(yearRaw) : null;
  const mileage = mileageRaw ? Number(mileageRaw) : null;
  if (!customerId || !plateNumber || !make || !model) {
    throw new Error("العميل ولوحة السيارة والماركة والموديل مطلوبة");
  }
  return { customerId, plateNumber, make, model, vin, color, year, mileage };
}

export async function createVehicle(formData: FormData) {
  await requireActionAccess("/vehicles");
  const data = readVehicle(formData);
  if (data.vin) {
    const existing = await prisma.vehicle.findUnique({ where: { vin: data.vin } });
    if (existing) throw new Error("رقم الشاصي مستخدم مسبقاً");
  }
  const vehicle = await prisma.vehicle.create({ data });
  revalidatePath("/vehicles");
  revalidatePath(`/customers/${data.customerId}`);
  redirect(`/vehicles/${vehicle.id}`);
}

export async function updateVehicle(id: string, formData: FormData) {
  await requireActionAccess("/vehicles");
  const data = readVehicle(formData);
  if (data.vin) {
    const clash = await prisma.vehicle.findFirst({
      where: { vin: data.vin, NOT: { id } },
    });
    if (clash) throw new Error("رقم الشاصي مستخدم مسبقاً");
  }
  await prisma.vehicle.update({ where: { id }, data });
  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  revalidatePath(`/customers/${data.customerId}`);
  redirect(`/vehicles/${id}`);
}
