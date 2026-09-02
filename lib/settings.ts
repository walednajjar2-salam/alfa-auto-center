import type { WorkshopSettings } from "@prisma/client";
import { prisma } from "./prisma";

function fallbackSettings(): WorkshopSettings {
  return {
    id: "default",
    workshopName: "مركز ألفا لصيانة السيارات",
    phone: "",
    address: "",
    taxPercent: 0,
    countryCode: "962",
    updatedAt: new Date(0),
  };
}

export async function getSettings() {
  return prisma.workshopSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      workshopName: "مركز ألفا لصيانة السيارات",
      phone: "",
      address: "",
      taxPercent: 0,
      countryCode: "962",
    },
  });
}

export async function getPublicSettings() {
  try {
    return { settings: await getSettings(), databaseReady: true };
  } catch {
    return { settings: fallbackSettings(), databaseReady: false };
  }
}
