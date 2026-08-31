import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Alfa@2026", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "مدير النظام",
      username: "admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  if (process.env.SEED_DEMO !== "true") {
    console.log("Admin ready. Set SEED_DEMO=true to load sample workshop data.");
    return;
  }

  const ahmad = await prisma.customer.upsert({
    where: { phone: "0790001001" },
    update: {},
    create: {
      name: "أحمد الخالدي",
      phone: "0790001001",
      whatsapp: "0790001001",
      notes: "عميل دائم — يفضل المواعيد الصباحية",
    },
  });
  const sara = await prisma.customer.upsert({
    where: { phone: "0780002002" },
    update: {},
    create: {
      name: "سارة النجار",
      phone: "0780002002",
      whatsapp: "0780002002",
    },
  });
  const khaled = await prisma.customer.upsert({
    where: { phone: "0770003003" },
    update: {},
    create: {
      name: "خالد العبادي",
      phone: "0770003003",
    },
  });

  const bmw = await prisma.vehicle.upsert({
    where: { vin: "WBA5A7C50FG000001" },
    update: {},
    create: {
      customerId: ahmad.id,
      plateNumber: "12-34567",
      vin: "WBA5A7C50FG000001",
      make: "BMW",
      model: "520i",
      year: 2020,
      color: "أسود",
      mileage: 86420,
    },
  });
  const lc = await prisma.vehicle.upsert({
    where: { vin: "JTMHV05J104000002" },
    update: {},
    create: {
      customerId: sara.id,
      plateNumber: "22-88910",
      vin: "JTMHV05J104000002",
      make: "Toyota",
      model: "Land Cruiser",
      year: 2021,
      color: "أبيض",
      mileage: 54210,
    },
  });
  const kia = await prisma.vehicle.upsert({
    where: { vin: "KNAFK4A64E5000003" },
    update: {},
    create: {
      customerId: khaled.id,
      plateNumber: "33-11002",
      vin: "KNAFK4A64E5000003",
      make: "KIA",
      model: "Cerato",
      year: 2021,
      color: "رمادي",
      mileage: 41002,
    },
  });

  const wo1 = await prisma.workOrder.upsert({
    where: { orderNumber: "ALFA-2026-00123" },
    update: {},
    create: {
      orderNumber: "ALFA-2026-00123",
      customerId: khaled.id,
      vehicleId: kia.id,
      status: "READY",
      complaint: "صوت من الفرامل عند التوقف",
      mileage: 41002,
      items: {
        create: [
          { kind: "LABOR", description: "تغيير فحمات أمامية", quantity: 1, unitPrice: 35 },
          { kind: "PART", description: "فحمات فرامل أمامية", quantity: 1, unitPrice: 48 },
        ],
      },
    },
  });

  await prisma.workOrder.upsert({
    where: { orderNumber: "ALFA-2026-00124" },
    update: {},
    create: {
      orderNumber: "ALFA-2026-00124",
      customerId: sara.id,
      vehicleId: lc.id,
      status: "IN_SERVICE",
      complaint: "صيانة دورية 50,000 كم",
      mileage: 54210,
      items: {
        create: [
          { kind: "LABOR", description: "صيانة دورية", quantity: 1, unitPrice: 40 },
          { kind: "PART", description: "زيت محرك + فلتر", quantity: 1, unitPrice: 85 },
        ],
      },
    },
  });

  await prisma.workOrder.upsert({
    where: { orderNumber: "ALFA-2026-00125" },
    update: {},
    create: {
      orderNumber: "ALFA-2026-00125",
      customerId: ahmad.id,
      vehicleId: bmw.id,
      status: "INSPECTION",
      complaint: "اهتزاز في التوجيه على السرعة العالية",
      mileage: 86420,
    },
  });

  const existingInvoice = await prisma.invoice.findUnique({ where: { invoiceNumber: "INV-2026-00001" } });
  if (!existingInvoice) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2026-00001",
        customerId: khaled.id,
        workOrderId: wo1.id,
        status: "PAID",
        subtotal: 83,
        tax: 0,
        total: 83,
        issuedAt: new Date(),
        items: {
          create: [
            { description: "أجور — تغيير فحمات أمامية", quantity: 1, unitPrice: 35 },
            { description: "قطعة — فحمات فرامل أمامية", quantity: 1, unitPrice: 48 },
          ],
        },
        payments: {
          create: [{ amount: 83, method: "CASH", notes: "تسديد كامل عند التسليم" }],
        },
      },
    });
  }

  console.log("Seeded ALFA demo data. Login: admin / Alfa@2026");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
