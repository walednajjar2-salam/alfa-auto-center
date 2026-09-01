import { prisma } from "./prisma";

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
    },
  });
}
