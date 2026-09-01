"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireActionAccess } from "@/lib/guard";

function readSupplier(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!name || !phone) throw new Error("اسم المورد والهاتف مطلوبان");
  return { name, phone, notes };
}

export async function createSupplier(formData: FormData) {
  await requireActionAccess("/suppliers");
  const data = readSupplier(formData);
  const existing = await prisma.supplier.findUnique({ where: { phone: data.phone } });
  if (existing) throw new Error("يوجد مورد بنفس رقم الهاتف");
  const supplier = await prisma.supplier.create({ data });
  revalidatePath("/suppliers");
  redirect(`/suppliers/${supplier.id}`);
}

export async function updateSupplier(id: string, formData: FormData) {
  await requireActionAccess("/suppliers");
  const data = readSupplier(formData);
  const clash = await prisma.supplier.findFirst({ where: { phone: data.phone, NOT: { id } } });
  if (clash) throw new Error("يوجد مورد بنفس رقم الهاتف");
  await prisma.supplier.update({ where: { id }, data });
  revalidatePath("/suppliers");
  revalidatePath(`/suppliers/${id}`);
  redirect(`/suppliers/${id}`);
}
