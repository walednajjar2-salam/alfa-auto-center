import type { PrismaClient } from "@prisma/client";

export const UNOFFICIAL_RANGE_ROVER_QUOTE = {
  quoteNumber: "QT-2026-00001",
  customerName: "وليد محمد النجار",
  customerPhone: "0790004004",
  beneficiaryName: "يزن محمد عبدالهادي النجار",
  vehicleMake: "رنج روفر",
  vehicleModel: "Range Rover",
  vehicleYear: 2025,
  vehicleTrim: "SE",
  vehicleSpecs: "تقدير سوق غير رسمي — المواصفات النهائية حسب الاتفاق، وليست عرض الوكيل المعتمد.",
  itemDescription: "رنج روفر موديل 2025 — تقدير سعر غير رسمي",
  unitPrice: 110000,
  notes:
    "عرض سعر غير رسمي صادر عن مركز ألفا لصيانة السيارات. ليس عرض الوكيل المعتمد، وغير ملزم لأي طرف، والأسعار تقديرية وقابلة للتغيير.\nالسعر تقديري من مركز ألفا ولا يشمل الرسوم الحكومية أو التأمين إلا إذا ذُكر خلاف ذلك.",
};

export async function ensureUnofficialRangeRoverQuote(db: PrismaClient) {
  const data = UNOFFICIAL_RANGE_ROVER_QUOTE;
  const customer = await db.customer.upsert({
    where: { phone: data.customerPhone },
    update: { name: data.customerName },
    create: {
      name: data.customerName,
      phone: data.customerPhone,
      whatsapp: data.customerPhone,
      notes: `عرض سعر غير رسمي — ${data.vehicleMake} ${data.vehicleYear} لصالح ${data.beneficiaryName}`,
    },
  });

  const existing = await db.quotation.findUnique({ where: { quoteNumber: data.quoteNumber } });
  if (existing) return existing;

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);

  return db.quotation.create({
    data: {
      quoteNumber: data.quoteNumber,
      customerId: customer.id,
      beneficiaryName: data.beneficiaryName,
      vehicleMake: data.vehicleMake,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      vehicleTrim: data.vehicleTrim,
      vehicleSpecs: data.vehicleSpecs,
      status: "ISSUED",
      issuedAt: new Date(),
      validUntil,
      subtotal: data.unitPrice,
      tax: 0,
      total: data.unitPrice,
      notes: data.notes,
      items: {
        create: [{ description: data.itemDescription, quantity: 1, unitPrice: data.unitPrice }],
      },
    },
  });
}
