"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { QuotationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { lineTotal } from "@/lib/format";
import { getSettings } from "@/lib/settings";
import { nextQuoteNumber } from "@/lib/numbers";
import { requireActionAccess } from "@/lib/guard";

const UNOFFICIAL_NOTE =
  "عرض سعر غير رسمي صادر عن مركز ألفا لصيانة السيارات. ليس عرض الوكيل المعتمد، وغير ملزم لأي طرف، والأسعار تقديرية وقابلة للتغيير.";

function quoteTotals(items: { quantity: number; unitPrice: number }[], taxRate = 0) {
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unitPrice), 0);
  const tax = Math.round(subtotal * taxRate * 1000) / 1000;
  return { subtotal, tax, total: Math.round((subtotal + tax) * 1000) / 1000 };
}

function readItems(formData: FormData) {
  const descriptions = formData.getAll("description").map((v) => String(v).trim());
  const quantities = formData.getAll("quantity").map((v) => Number(v));
  const unitPrices = formData.getAll("unitPrice").map((v) => Number(v));
  const items = descriptions
    .map((description, index) => ({
      description,
      quantity: quantities[index] || 1,
      unitPrice: unitPrices[index] || 0,
    }))
    .filter((item) => item.description && item.quantity > 0);
  if (items.length === 0) throw new Error("أضف بنداً واحداً على الأقل");
  return items;
}

async function resolveCustomer(formData: FormData) {
  const customerId = String(formData.get("customerId") ?? "").trim();
  if (customerId) {
    const existing = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!existing) throw new Error("العميل غير موجود");
    return existing;
  }
  const name = String(formData.get("newCustomerName") ?? "").trim();
  const phone = String(formData.get("newCustomerPhone") ?? "").trim();
  if (!name || !phone) throw new Error("اختر عميلاً أو أدخل اسم ورقم هاتف لعميل جديد");
  const existing = await prisma.customer.findUnique({ where: { phone } });
  if (existing) return existing;
  return prisma.customer.create({ data: { name, phone, whatsapp: phone } });
}

export async function createQuotation(formData: FormData) {
  await requireActionAccess("/quotations");
  const customer = await resolveCustomer(formData);
  const beneficiaryName = String(formData.get("beneficiaryName") ?? "").trim() || null;
  const vehicleMake = String(formData.get("vehicleMake") ?? "").trim();
  const vehicleModel = String(formData.get("vehicleModel") ?? "").trim();
  const vehicleYearRaw = String(formData.get("vehicleYear") ?? "").trim();
  const vehicleYear = vehicleYearRaw ? Number(vehicleYearRaw) : null;
  const vehicleTrim = String(formData.get("vehicleTrim") ?? "").trim() || null;
  const vehicleColor = String(formData.get("vehicleColor") ?? "").trim() || null;
  const vehicleSpecs = String(formData.get("vehicleSpecs") ?? "").trim() || null;
  const extraNotes = String(formData.get("notes") ?? "").trim();
  const validUntilRaw = String(formData.get("validUntil") ?? "").trim();
  if (!vehicleMake || !vehicleModel) throw new Error("أدخل نوع وموديل السيارة");
  if (vehicleYearRaw && Number.isNaN(vehicleYear)) throw new Error("سنة الصنع غير صحيحة");

  const items = readItems(formData);
  const settings = await getSettings();
  const totals = quoteTotals(items, settings.taxPercent / 100);
  const validUntil = validUntilRaw
    ? new Date(`${validUntilRaw}T23:59:59`)
    : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const notes = [UNOFFICIAL_NOTE, extraNotes].filter(Boolean).join("\n");

  const quotation = await prisma.quotation.create({
    data: {
      quoteNumber: await nextQuoteNumber(),
      customerId: customer.id,
      beneficiaryName,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleTrim,
      vehicleColor,
      vehicleSpecs,
      status: "ISSUED",
      issuedAt: new Date(),
      validUntil,
      notes,
      ...totals,
      items: { create: items },
    },
  });

  revalidatePath("/quotations");
  revalidatePath(`/customers/${customer.id}`);
  redirect(`/quotations/${quotation.id}/print`);
}

export async function updateQuotationStatus(id: string, formData: FormData) {
  await requireActionAccess("/quotations");
  const status = String(formData.get("status") ?? "") as QuotationStatus;
  const allowed: QuotationStatus[] = ["DRAFT", "ISSUED", "ACCEPTED", "EXPIRED", "VOID"];
  if (!allowed.includes(status)) throw new Error("حالة غير صحيحة");
  const quotation = await prisma.quotation.update({ where: { id }, data: { status } });
  revalidatePath("/quotations");
  revalidatePath(`/quotations/${id}`);
  revalidatePath(`/customers/${quotation.customerId}`);
}
