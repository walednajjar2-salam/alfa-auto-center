"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

function readUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const role = (String(formData.get("role") ?? "RECEPTION") as UserRole) || "RECEPTION";
  const password = String(formData.get("password") ?? "");
  const isActive = String(formData.get("isActive") ?? "true") !== "false";
  if (!name || !username) throw new Error("الاسم واسم المستخدم مطلوبان");
  return { name, username, role, password, isActive };
}

export async function createUser(formData: FormData) {
  await requireAdmin();
  const data = readUser(formData);
  if (!data.password || data.password.length < 6) {
    throw new Error("كلمة المرور يجب ألا تقل عن 6 أحرف");
  }
  const existing = await prisma.user.findUnique({ where: { username: data.username } });
  if (existing) throw new Error("اسم المستخدم مستخدم مسبقاً");
  await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
      role: data.role,
      isActive: data.isActive,
      passwordHash: await bcrypt.hash(data.password, 10),
    },
  });
  revalidatePath("/users");
  redirect("/users");
}

export async function updateUser(id: string, formData: FormData) {
  await requireAdmin();
  const data = readUser(formData);
  const clash = await prisma.user.findFirst({ where: { username: data.username, NOT: { id } } });
  if (clash) throw new Error("اسم المستخدم مستخدم مسبقاً");
  const patch: {
    name: string;
    username: string;
    role: UserRole;
    isActive: boolean;
    passwordHash?: string;
  } = {
    name: data.name,
    username: data.username,
    role: data.role,
    isActive: data.isActive,
  };
  if (data.password) {
    if (data.password.length < 6) throw new Error("كلمة المرور يجب ألا تقل عن 6 أحرف");
    patch.passwordHash = await bcrypt.hash(data.password, 10);
  }
  await prisma.user.update({ where: { id }, data: patch });
  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  redirect("/users");
}
