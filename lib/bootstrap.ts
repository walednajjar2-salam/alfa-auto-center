import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

let started = false;

export async function ensureAdmin() {
  if (started) return;
  const count = await prisma.user.count();
  if (count === 0) {
    const password = process.env.ADMIN_PASSWORD || "Alfa@2026";
    await prisma.user.create({
      data: {
        name: "مدير النظام",
        username: "admin",
        passwordHash: await bcrypt.hash(password, 10),
        role: "ADMIN",
      },
    });
  }
  started = true;
}
