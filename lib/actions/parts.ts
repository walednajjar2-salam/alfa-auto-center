"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readPart(formData: FormData) {
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const category = String(formData.get("category") ?? "").trim() || null;
  const unit = String(formData.get("unit") ?? "قطعة").trim() || "قطعة";
  const costPrice = Number(formData.get("costPrice") ?? 0) || 0;
  const salePrice = Number(formData.get("salePrice") ?? 0) || 0;
  const quantity = Number(formData.get("quantity") ?? 0) || 0;
  const minQuantity = Number(formData.get("minQuantity") ?? 2) || 0;
  const supplierId = String(formData.get("supplierId") ?? "").trim() || null;
  if (!sku || !name) throw new Error("رمز القطعة واسمها مطلوبان");
  return { sku, name, brand, category, unit, costPrice, salePrice, quantity, minQuantity, supplierId };
}

export async function createPart(formData: FormData) {
  const data = readPart(formData);
  const existing = await prisma.part.findUnique({ where: { sku: data.sku } });
  if (existing) throw new Error("رمز القطعة مستخدم مسبقاً");
  const part = await prisma.part.create({ data });
  revalidatePath("/parts");
  revalidatePath("/inventory");
  redirect(`/parts/${part.id}`);
}

export async function updatePart(id: string, formData: FormData) {
  const data = readPart(formData);
  const clash = await prisma.part.findFirst({ where: { sku: data.sku, NOT: { id } } });
  if (clash) throw new Error("رمز القطعة مستخدم مسبقاً");
  await prisma.part.update({ where: { id }, data });
  revalidatePath("/parts");
  revalidatePath("/inventory");
  revalidatePath(`/parts/${id}`);
  redirect(`/parts/${id}`);
}
