"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireActionAccess } from "@/lib/guard";

export async function createExpense(formData: FormData) {
  await requireActionAccess("/expenses");
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "أخرى").trim() || "أخرى";
  const amount = Number(formData.get("amount") ?? 0);
  const method = (String(formData.get("method") ?? "CASH") as PaymentMethod) || "CASH";
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const spentAtRaw = String(formData.get("spentAt") ?? "").trim();
  if (!title || amount <= 0) throw new Error("أدخل البيان ومبلغاً صحيحاً");
  await prisma.expense.create({
    data: {
      title,
      category,
      amount,
      method,
      notes,
      spentAt: spentAtRaw ? new Date(spentAtRaw) : new Date(),
    },
  });
  revalidatePath("/expenses");
  revalidatePath("/cash");
  revalidatePath("/reports");
  redirect("/expenses");
}
