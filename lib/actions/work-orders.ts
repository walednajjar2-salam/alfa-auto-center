"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ItemKind, WorkOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { nextWorkOrderNumber } from "@/lib/numbers";

export async function receiveVehicle(formData: FormData) {
  let customerId = String(formData.get("customerId") ?? "").trim();
  let vehicleId = String(formData.get("vehicleId") ?? "").trim();
  const complaint = String(formData.get("complaint") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const mileageRaw = String(formData.get("mileage") ?? "").trim();
  const mileage = mileageRaw ? Number(mileageRaw) : null;

  if (!complaint) throw new Error("أدخل شكوى العميل أو سبب الزيارة");

  if (!customerId) {
    const name = String(formData.get("newCustomerName") ?? "").trim();
    const phone = String(formData.get("newCustomerPhone") ?? "").trim();
    if (!name || !phone) throw new Error("اختر عميلاً أو أدخل اسمه وهاتفه");
    const existing = await prisma.customer.findUnique({ where: { phone } });
    customerId = existing
      ? existing.id
      : (await prisma.customer.create({ data: { name, phone } })).id;
  }

  if (!vehicleId) {
    const plateNumber = String(formData.get("newPlateNumber") ?? "").trim();
    const make = String(formData.get("newMake") ?? "").trim();
    const model = String(formData.get("newModel") ?? "").trim();
    const yearRaw = String(formData.get("newYear") ?? "").trim();
    if (!plateNumber || !make || !model) {
      throw new Error("اختر سيارة أو أدخل اللوحة والماركة والموديل");
    }
    const vehicle = await prisma.vehicle.create({
      data: {
        customerId,
        plateNumber,
        make,
        model,
        year: yearRaw ? Number(yearRaw) : null,
        mileage,
      },
    });
    vehicleId = vehicle.id;
  } else if (mileage != null) {
    await prisma.vehicle.update({ where: { id: vehicleId }, data: { mileage } });
  }

  const vehicle = await prisma.vehicle.findUniqueOrThrow({ where: { id: vehicleId } });
  if (vehicle.customerId !== customerId) {
    throw new Error("السيارة لا تتبع هذا العميل");
  }

  const workOrder = await prisma.workOrder.create({
    data: {
      orderNumber: await nextWorkOrderNumber(),
      customerId,
      vehicleId,
      complaint,
      mileage,
      notes,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/work-orders");
  redirect(`/work-orders/${workOrder.id}`);
}

export async function updateWorkOrderStatus(id: string, status: WorkOrderStatus) {
  await prisma.workOrder.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
  revalidatePath("/work-orders");
  revalidatePath(`/work-orders/${id}`);
}

export async function addWorkOrderItem(workOrderId: string, formData: FormData) {
  const partId = String(formData.get("partId") ?? "").trim() || null;
  let description = String(formData.get("description") ?? "").trim();
  let kind = (String(formData.get("kind") ?? "LABOR") as ItemKind) || "LABOR";
  const quantity = Number(formData.get("quantity") ?? 1) || 1;
  let unitPrice = Number(formData.get("unitPrice") ?? 0) || 0;

  if (partId) {
    const part = await prisma.part.findUniqueOrThrow({ where: { id: partId } });
    if (part.quantity < quantity) {
      throw new Error(`الكمية المتاحة من ${part.name} هي ${part.quantity} فقط`);
    }
    kind = "PART";
    description = description || part.name;
    if (!unitPrice) unitPrice = part.salePrice;
    await prisma.$transaction([
      prisma.workOrderItem.create({
        data: { workOrderId, partId, kind, description, quantity, unitPrice },
      }),
      prisma.part.update({
        where: { id: partId },
        data: { quantity: { decrement: quantity } },
      }),
    ]);
  } else {
    if (!description) throw new Error("أدخل وصف البند");
    await prisma.workOrderItem.create({
      data: { workOrderId, kind, description, quantity, unitPrice },
    });
  }
  revalidatePath(`/work-orders/${workOrderId}`);
  revalidatePath("/inventory");
  revalidatePath("/parts");
}

export async function removeWorkOrderItem(workOrderId: string, itemId: string) {
  const item = await prisma.workOrderItem.findUniqueOrThrow({ where: { id: itemId } });
  await prisma.$transaction(async (tx) => {
    if (item.partId) {
      await tx.part.update({
        where: { id: item.partId },
        data: { quantity: { increment: item.quantity } },
      });
    }
    await tx.workOrderItem.delete({ where: { id: itemId } });
  });
  revalidatePath(`/work-orders/${workOrderId}`);
  revalidatePath("/inventory");
  revalidatePath("/parts");
}
