"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { lineTotal } from "@/lib/format";
import { nextPurchaseNumber } from "@/lib/numbers";

async function refreshPurchaseTotal(purchaseId: string) {
  const items = await prisma.purchaseItem.findMany({ where: { purchaseId } });
  const total = items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitCost), 0);
  await prisma.purchase.update({ where: { id: purchaseId }, data: { total } });
}

export async function createPurchase(formData: FormData) {
  const supplierId = String(formData.get("supplierId") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!supplierId) throw new Error("اختر مورداً");
  const purchase = await prisma.purchase.create({
    data: {
      number: await nextPurchaseNumber(),
      supplierId,
      notes,
    },
  });
  revalidatePath("/purchases");
  redirect(`/purchases/${purchase.id}`);
}

export async function addPurchaseItem(purchaseId: string, formData: FormData) {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: purchaseId } });
  if (purchase.status !== "DRAFT") throw new Error("لا يمكن تعديل مشترى مستلم");
  const partId = String(formData.get("partId") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const unitCost = Number(formData.get("unitCost") ?? 0);
  if (!partId || quantity <= 0) throw new Error("اختر قطعة وأدخل كمية صحيحة");
  await prisma.purchaseItem.create({ data: { purchaseId, partId, quantity, unitCost } });
  await refreshPurchaseTotal(purchaseId);
  revalidatePath(`/purchases/${purchaseId}`);
  revalidatePath("/purchases");
}

export async function removePurchaseItem(purchaseId: string, itemId: string) {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: purchaseId } });
  if (purchase.status !== "DRAFT") throw new Error("لا يمكن تعديل مشترى مستلم");
  await prisma.purchaseItem.delete({ where: { id: itemId } });
  await refreshPurchaseTotal(purchaseId);
  revalidatePath(`/purchases/${purchaseId}`);
}

export async function receivePurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUniqueOrThrow({
    where: { id: purchaseId },
    include: { items: true },
  });
  if (purchase.status !== "DRAFT") throw new Error("تم استلام هذا المشترى مسبقاً");
  if (purchase.items.length === 0) throw new Error("أضف بنوداً قبل الاستلام");

  await prisma.$transaction(async (tx) => {
    for (const item of purchase.items) {
      await tx.part.update({
        where: { id: item.partId },
        data: {
          quantity: { increment: item.quantity },
          costPrice: item.unitCost,
        },
      });
    }
    await tx.purchase.update({
      where: { id: purchaseId },
      data: { status: "RECEIVED", receivedAt: new Date() },
    });
  });

  revalidatePath("/purchases");
  revalidatePath("/parts");
  revalidatePath("/inventory");
  revalidatePath(`/purchases/${purchaseId}`);
}

export async function cancelPurchase(purchaseId: string) {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: purchaseId } });
  if (purchase.status !== "DRAFT") throw new Error("لا يمكن إلغاء مشترى مستلم");
  await prisma.purchase.update({ where: { id: purchaseId }, data: { status: "CANCELLED" } });
  revalidatePath("/purchases");
  revalidatePath(`/purchases/${purchaseId}`);
}
