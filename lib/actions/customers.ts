"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function readCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!name || !phone) throw new Error("الاسم ورقم الهاتف مطلوبان");
  return { name, phone, whatsapp, notes };
}

export async function createCustomer(formData: FormData) {
  const data = readCustomer(formData);
  const existing = await prisma.customer.findUnique({ where: { phone: data.phone } });
  if (existing) throw new Error("يوجد عميل بنفس رقم الهاتف");
  const customer = await prisma.customer.create({ data });
  revalidatePath("/customers");
  redirect(`/customers/${customer.id}`);
}

export async function updateCustomer(id: string, formData: FormData) {
  const data = readCustomer(formData);
  const clash = await prisma.customer.findFirst({
    where: { phone: data.phone, NOT: { id } },
  });
  if (clash) throw new Error("يوجد عميل بنفس رقم الهاتف");
  await prisma.customer.update({ where: { id }, data });
  revalidatePath("/customers");
  revalidatePath(`/customers/${id}`);
  redirect(`/customers/${id}`);
}
